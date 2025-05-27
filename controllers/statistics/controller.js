const DomainServices = require("../../models/services/domain/model");
const HostingServices = require("../../models/services/hosting/model");
const EmailServices = require("../../models/services/email/model");
const SslServices = require("../../models/services/ssl/model");
const WebsiteServices = require("../../models/services/website/model");
const ContentServices = require("../../models/services/content/model");
const ToplistServices = require("../../models/services/toplist/model");
const MaintenanceServices = require("../../models/services/maintenance/model");
const MobileNetworkServices = require("../../models/services/mobile-network/model");

const statisticsController = {
  getYears: async(req, res) => {
    try {
      const { service } = req.query;

      if (!service) {
        return res.status(400).json({message: 'Vui lòng chọn dịch vụ!'});
      }

      const serviceNum = parseInt(service);
      let model = null;
      let matchField = "registeredAt";

      switch (serviceNum) {
        case 1:
          model = DomainServices;
          break;
        case 2:
          model = HostingServices;
          break;
        case 3:
          model = EmailServices;
          break;
        case 4:
          model = SslServices;
          break;
        case 5:
          model = WebsiteServices;
          matchField = "createdAt";
          break;
        case 6:
          model = ContentServices;
          break;
        case 7:
          model = ToplistServices;
          break;
        case 8:
          model = MaintenanceServices;
          break;
        case 9:
          model = MobileNetworkServices;
          break;
        default:
          return res.status(400).json({ message: 'Dịch vụ không hợp lệ!' });
      }

      const years = await model.aggregate([
        {
          $match: { [matchField]: { $ne: null } }
        },
        {
          $project: {
            year: { $year: `$${matchField}` }
          }
        },
        {
          $group: {
            _id: "$year"
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);
  
      const formattedYears = years.map(item => item._id.toString());
  
      return res.json(formattedYears);
    } catch (err) {
      console.error("Lỗi lấy danh sách năm:", err);
      return res.status(500).send(err.message);
    }
  },

  getStatistics: async (req, res) => {
    const { year, service } = req.query;
  
    if (!year || !service) {
      return res.status(400).json({ message: "Vui lòng chọn năm và dịch vụ!" });
    }
  
    const serviceNum = parseInt(service);
    const start = new Date(`${year}-01-01`);
    const end = new Date(`${parseInt(year) + 1}-01-01`);
  
    const serviceConfigs = {
      1: { model: DomainServices, planField: "domain_plan_id", planCollection: "domainplans", dateField: "registeredAt" },
      2: { model: HostingServices, planField: "hosting_plan_id", planCollection: "hostingplans", dateField: "registeredAt" },
      3: { model: SslServices, planField: "ssl_plan_id", planCollection: "sslplans", dateField: "registeredAt" },
      4: { model: EmailServices, planField: "email_plan_id", planCollection: "emailplans", dateField: "registeredAt" },
      5: { model: WebsiteServices, dateField: "createdAt", priceOnly: true },
      6: { model: ContentServices, planField: "content_plan_id", planCollection: "contentplans", dateField: "registeredAt" },
      7: { model: ToplistServices, dateField: "registeredAt", priceOnly: true },
      8: { model: MaintenanceServices, planField: "maintenance_plan_id", planCollection: "maintenanceplans", dateField: "registeredAt" },
      9: { model: MobileNetworkServices, planField: "mobile_network_plan_id", planCollection: "mobilenetworkplans", dateField: "registeredAt" }
    };
  
    const config = serviceConfigs[serviceNum];
  
    if (!config) {
      return res.status(400).json({ message: "Dịch vụ chưa được hỗ trợ!" });
    }
  
    let results = [];
  
    if (config.priceOnly) {
      results = await config.model.aggregate([
        {
          $match: {
            [config.dateField]: { $gte: start, $lt: end }
          }
        },
        {
          $group: {
            _id: { $month: `$${config.dateField}` },
            price: { $sum: "$price" }
          }
        },
        {
          $project: {
            month: "$_id",
            price: 1,
            import_price: { $literal: 0 },
            profit: "$price",
            _id: 0
          }
        },
        { $sort: { month: 1 } }
      ]);
    } else {
      results = await config.model.aggregate([
        {
          $match: {
            [config.dateField]: { $gte: start, $lt: end },
            [config.planField]: { $ne: null }
          }
        },
        {
          $lookup: {
            from: config.planCollection,
            localField: config.planField,
            foreignField: "_id",
            as: "plan"
          }
        },
        { $unwind: "$plan" },
        {
          $group: {
            _id: { $month: `$${config.dateField}` },
            import_price: { $sum: "$plan.import_price" },
            price: { $sum: "$plan.price" }
          }
        },
        {
          $project: {
            month: "$_id",
            import_price: 1,
            price: 1,
            profit: { $subtract: ["$price", "$import_price"] },
            _id: 0
          }
        },
        { $sort: { month: 1 } }
      ]);
    }
  
    const formatted = results.map(item => ({
      month: `Tháng ${item.month}`,
      import_price: item.import_price,
      price: item.price,
      profit: item.profit
    }));
  
    const total = formatted.reduce((acc, item) => {
      acc.import_price += item.import_price;
      acc.price += item.price;
      acc.profit += item.profit;
      return acc;
    }, { import_price: 0, price: 0, profit: 0 });
  
    return res.json({ data: formatted, total });
  }
}

module.exports = statisticsController;