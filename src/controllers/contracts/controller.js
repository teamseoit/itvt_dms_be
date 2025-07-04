const Contracts = require("../../models/contracts/model");
const logAction = require("../../middleware/actionLogs");
const { populateDomainServiceForHosting, populateHostingPlanForDomain, populateSslPlanForDomain, populateEmailPlanForDomain } = require("../../utils/contractUtils");
const ContractPaymentHistory = require("../../models/contracts/paymentHistory");

const normalizeText = (text) =>
  text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const contractController = {
  getContracts: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const keyword = req.query.keyword?.trim() || null;

      const contractsQuery = Contracts.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("customer", "fullName gender email phoneNumber")
        .populate("services.serviceId");

      const totalQuery = Contracts.countDocuments();

      let [contracts, total] = await Promise.all([contractsQuery, totalQuery]);

      if (keyword) {
        const normalizedKeyword = normalizeText(keyword);

        contracts = contracts.filter(contract => {
          const contractCodeMatch = contract.contractCode?.toLowerCase().includes(keyword.toLowerCase());
          const customerNameMatch = normalizeText(contract.customer?.fullName || "").includes(normalizedKeyword);
          return contractCodeMatch || customerNameMatch;
        });

        total = contracts.length;
      }

      const totalPages = Math.ceil(total / limit);

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách hợp đồng thành công.",
        data: contracts,
        meta: {
          page,
          limit,
          totalDocs: total,
          totalPages,
        },
      });
    } catch (error) {
      console.error("Error fetching contracts:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ khi lấy danh sách hợp đồng.",
      });
    }
  },

  getContractById: async (req, res) => {
    try {
      const contract = await Contracts.findById(req.params.id)
        .populate("customer")
        .populate("services.serviceId");

      if (!contract) {
        return res.status(404).json({ success: false, message: "Không tìm thấy hợp đồng." });
      }

      await populateDomainServiceForHosting([contract]);
      await populateHostingPlanForDomain([contract]);
      await populateSslPlanForDomain([contract]);
      await populateEmailPlanForDomain([contract]);

      return res.status(200).json({ success: true, data: contract });
    } catch (err) {
      console.error("Error getting contract by ID:", err);
      return res.status(500).json({ success: false, message: "Lỗi máy chủ." });
    }
  },

  updateContract: async (req, res) => {
    try {
      const contract = await Contracts.findById(req.params.id);
      if (!contract) {
        return res.status(404).json({ success: false, message: "Không tìm thấy hợp đồng." });
      }

      const { amountPaid, paymentMethod, paymentNote } = req.body;
      if (typeof amountPaid !== 'number') {
        return res.status(400).json({ success: false, message: "Vui lòng nhập số tiền thanh toán hợp lệ." });
      }

      const prevPaid = contract.financials.amountPaid || 0;
      const total = Math.round(contract.financials.totalAmount);
      const newPaid = amountPaid;
      const paymentThisTime = newPaid - prevPaid;
      if (paymentThisTime < 0) {
        return res.status(400).json({ success: false, message: "Số tiền thanh toán không hợp lệ (không được nhỏ hơn số đã thanh toán trước đó)." });
      }
      const amountRemaining = total - newPaid;
      const isFullyPaid = (newPaid == total) ? true : false;

      const updateData = {
        financials: {
          ...contract.financials,
          amountPaid: newPaid,
          amountRemaining,
          isFullyPaid,
        },
      };

      if (paymentThisTime > 0) {
        await ContractPaymentHistory.create({
          contractId: contract._id,
          amount: paymentThisTime,
          method: paymentMethod || 'Chuyển khoản',
          note: paymentNote || '',
          createdBy: req.auth?.username || req.auth?._id || 'system'
        });
      }

      await contract.updateOne({ $set: updateData });
      await logAction(req.auth._id, "Hợp đồng", "Cập nhật", `/hop-dong/${req.params.id}`);

      return res.status(200).json({ 
        success: true, 
        message: "Cập nhật thành công!",
        data: {
          ...contract.toObject(),
          ...updateData
        }
      });
    } catch (err) {
      console.error("Error updating contract:", err);
      return res.status(500).json({ success: false, message: "Lỗi máy chủ." });
    }
  },

  deleteContract: async (req, res) => {
    try {
      const deleted = await Contracts.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Không tìm thấy hợp đồng." });
      }

      await logAction(req.auth._id, "Hợp đồng", "Xóa");

      return res.status(200).json({ success: true, message: "Xóa thành công!" });
    } catch (err) {
      console.error("Error deleting contract:", err);
      return res.status(500).json({ success: false, message: "Lỗi máy chủ." });
    }
  },

  getPaymentHistory: async (req, res) => {
    try {
      const contractId = req.params.id;
      const history = await ContractPaymentHistory.find({ contractId }).sort({ paymentDate: -1 });
      return res.status(200).json({
        success: true,
        data: history
      });
    } catch (err) {
      console.error("Error fetching payment history:", err);
      return res.status(500).json({ success: false, message: "Lỗi máy chủ." });
    }
  },
};

module.exports = contractController;
