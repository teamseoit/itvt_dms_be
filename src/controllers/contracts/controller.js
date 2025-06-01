const Contracts = require("../../models/contracts/model");
const logAction = require("../../middleware/actionLogs");

const contractController = {
  getContract: async(req, res) => {
    try {
      const contract = await Contracts.find().sort({"createdAt": -1}).populate('customer_id');
      return res.status(200).json(contract);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getDetailContract: async(req, res) => {
    try {
      const contract = await Contracts.findById(req.params.id).populate('customer_id');
      return res.status(200).json(contract);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  deleteContract: async(req, res) => {
    try {
      await Contracts.findByIdAndDelete(req.params.id);
      await logAction(req.auth._id, 'Hợp đồng', 'Xóa');
      return res.status(200).json("Xóa thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  updateContract: async(req, res) => {
    try {
      const contract = await Contracts.findById(req.params.id);
      let total_price = contract.total_price;
      let deposit_amount = req.body.deposit_amount;
      let remaining_cost_body = req.body.remaining_cost;
      let remaining_cost = 0;
      
      if (deposit_amount) {
        if (deposit_amount == total_price) {
          await contract.updateOne({
            $set: {
              deposit_amount: deposit_amount,
              remaining_cost: 0,
              status: 2
            }
          });
        } else {
          remaining_cost = total_price - deposit_amount;
          await contract.updateOne({
            $set: {
              deposit_amount: deposit_amount,
              remaining_cost: remaining_cost,
              status: 1
            }
          });
        }
      }

      if (remaining_cost_body) {
        if ((contract.deposit_amount + remaining_cost_body) === total_price) {
          await contract.updateOne({
            $set: {
              deposit_amount: total_price,
              remaining_cost: 0,
              status: 2
            }
          });
        }
      }

      await contract.updateOne({$set: req.body});
      await logAction(req.auth._id, 'Hợp đồng', 'Cập nhật', `/trang-chu/hop-dong/cap-nhat-hop-dong/${req.params.id}`);
      return res.status(200).json("Cập nhật thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  }
}

module.exports = contractController;