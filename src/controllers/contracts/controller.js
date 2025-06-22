const Contracts = require("../../models/contracts/model");
const logAction = require("../../middleware/actionLogs");

const contractController = {
  getContracts: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const searchQuery = {};
      
      if (req.query.keyword) {
        const normalizedKeyword = req.query.keyword.toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

        const [contracts, total] = await Promise.all([
          Contracts.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
              path: "customer",
              select: "fullName gender email phoneNumber"
            }),
          Contracts.countDocuments(searchQuery)
        ]);

        const filteredContracts = contracts.filter(contract => {
          const contractCodeMatch = contract.contractCode?.toLowerCase().includes(req.query.keyword.toLowerCase());
          
          const customerNameMatch = contract.customer?.fullName
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(normalizedKeyword);

          return contractCodeMatch || customerNameMatch;
        });
        
        const filteredTotal = filteredContracts.length;
        const totalPages = Math.ceil(filteredTotal / limit);

        return res.status(200).json({
          success: true,
          message: "Lấy danh sách hợp đồng thành công.",
          data: filteredContracts,
          meta: {
            page,
            limit,
            totalDocs: filteredTotal,
            totalPages,
          },
        });
      }

      const [contracts, total] = await Promise.all([
        Contracts.find(searchQuery)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate("customer", "fullName gender email phoneNumber"),
        Contracts.countDocuments(searchQuery)
      ]);

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

      res.status(200).json({ success: true, data: contract });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  updateContract: async (req, res) => {
    try {
      const contract = await Contracts.findById(req.params.id);
      if (!contract) {
        return res.status(404).json({ success: false, message: "Không tìm thấy hợp đồng." });
      }

      const total = contract.financials.grandTotal;
      const currentPaid = contract.financials.amountPaid;
      const addPayment = Number(req.body.amountPaid || 0);
      const newPaid = currentPaid + addPayment;

      let updateData = {
        ...req.body,
        financials: {
          ...contract.financials,
          amountPaid: newPaid,
          amountRemaining: total - newPaid,
          isFullyPaid: newPaid >= total,
        },
      };

      await contract.updateOne({ $set: updateData });
      await logAction(req.auth._id, "Hợp đồng", "Cập nhật", `/hop-dong/${req.params.id}`);

      res.status(200).json({ success: true, message: "Cập nhật thành công!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  deleteContract: async (req, res) => {
    try {
      await Contracts.findByIdAndDelete(req.params.id);
      await logAction(req.auth._id, "Hợp đồng", "Xóa");

      res.status(200).json({ success: true, message: "Xóa thành công!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  },
};

module.exports = contractController;
