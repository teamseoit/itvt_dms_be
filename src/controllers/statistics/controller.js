const DomainServices = require("../../models/services/domain/model");
const HostingServices = require("../../models/services/hosting/model");
const EmailServices = require("../../models/services/email/model");
const SslServices = require("../../models/services/ssl/model");
const WebsiteServices = require("../../models/services/website/model");

// Mapping dịch vụ với ID và thông tin
const SERVICES_MAP = {
  1: { name: 'Domain', model: DomainServices, priceField: 'totalPrice', dateField: 'registeredAt' },
  2: { name: 'Hosting', model: HostingServices, priceField: 'totalPrice', dateField: 'registeredAt' },
  3: { name: 'Email', model: EmailServices, priceField: 'totalPrice', dateField: 'registeredAt' },
  4: { name: 'SSL', model: SslServices, priceField: 'totalPrice', dateField: 'registeredAt' },
  5: { name: 'Website', model: WebsiteServices, priceField: 'price', dateField: 'createdAt' }
};

// Helper function để lấy danh sách dịch vụ
const getAllServices = () => Object.keys(SERVICES_MAP).map(id => ({
  id: parseInt(id),
  name: SERVICES_MAP[id].name
}));

// Helper function để lấy dịch vụ theo ID
const getServicesByIds = (serviceIds) => {
  if (!serviceIds || serviceIds.length === 0) {
    return Object.values(SERVICES_MAP);
  }
  
  return serviceIds
    .map(id => SERVICES_MAP[id])
    .filter(service => service !== undefined);
};

const statisticsController = {
  // API lấy danh sách dịch vụ
  getServices: async (req, res) => {
    try {
      const services = getAllServices();
      return res.json(services);
    } catch (err) {
      console.error("Lỗi lấy danh sách dịch vụ:", err);
      return res.status(500).json({ message: err.message });
    }
  },

  getExpenseReportYears: async (req, res) => {
    try {
      const services = Object.values(SERVICES_MAP);

      const allYears = new Set();

      for (const service of services) {
        const years = await service.model.aggregate([
          {
            $match: { [service.dateField]: { $ne: null } }
          },
          {
            $project: {
              year: { $year: `$${service.dateField}` }
            }
          },
          {
            $group: {
              _id: "$year"
            }
          }
        ]);

        years.forEach(item => allYears.add(item._id));
      }

      const sortedYears = Array.from(allYears).sort().map(year => year.toString());
      return res.json(sortedYears);
    } catch (err) {
      console.error("Lỗi lấy danh sách năm chi phí:", err);
      return res.status(500).json({ message: err.message });
    }
  },

  // API mới để tổng hợp chi phí của các dịch vụ
  getServicesExpenseReport: async (req, res) => {
    try {
      const { year, month, services: serviceIds } = req.query;
      
      if (!year) {
        return res.status(400).json({ message: "Vui lòng chọn năm!" });
      }

      // Parse service IDs từ query string
      let selectedServiceIds = [];
      if (serviceIds) {
        if (typeof serviceIds === 'string') {
          selectedServiceIds = serviceIds.split(',').map(id => parseInt(id.trim()));
        } else if (Array.isArray(serviceIds)) {
          selectedServiceIds = serviceIds.map(id => parseInt(id));
        }
        
        // Validate service IDs
        const invalidIds = selectedServiceIds.filter(id => !SERVICES_MAP[id]);
        if (invalidIds.length > 0) {
          return res.status(400).json({ 
            message: `Dịch vụ không hợp lệ: ${invalidIds.join(', ')}` 
          });
        }
      }

      const start = new Date(`${year}-01-01`);
      const end = new Date(`${parseInt(year) + 1}-01-01`);
      
      // Nếu có tháng cụ thể, tính toán theo tháng
      if (month) {
        const monthNum = parseInt(month);
        if (monthNum < 1 || monthNum > 12) {
          return res.status(400).json({ message: "Tháng không hợp lệ!" });
        }
        
        const monthStart = new Date(`${year}-${monthNum.toString().padStart(2, '0')}-01`);
        const monthEnd = new Date(`${year}-${(monthNum + 1).toString().padStart(2, '0')}-01`);
        
        return await getMonthlyExpenseReport(res, monthStart, monthEnd, monthNum, selectedServiceIds);
      }
      
      // Nếu không có tháng, tính toán theo năm
      return await getYearlyExpenseReport(res, start, end, year, selectedServiceIds);
      
    } catch (err) {
      console.error("Lỗi tạo báo cáo chi phí:", err);
      return res.status(500).json({ message: err.message });
    }
  }
}

// Helper function để tính toán chi phí theo tháng
async function getMonthlyExpenseReport(res, start, end, month, selectedServiceIds = []) {
  const services = getServicesByIds(selectedServiceIds);

  const results = {};
  let totalExpense = 0;

  // Sử dụng Promise.all để tối ưu hiệu suất
  const servicePromises = services.map(async (service) => {
    const aggregation = await service.model.aggregate([
      {
        $match: {
          [service.dateField]: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: null,
          totalPrice: { $sum: `$${service.priceField}` },
          count: { $sum: 1 }
        }
      }
    ]);

    const serviceData = aggregation.length > 0 ? aggregation[0] : { totalPrice: 0, count: 0 };
    return {
      name: service.name,
      data: {
        totalPrice: serviceData.totalPrice,
        count: serviceData.count
      }
    };
  });

  const serviceResults = await Promise.all(servicePromises);
  
  serviceResults.forEach(({ name, data }) => {
    results[name] = data;
    totalExpense += data.totalPrice;
  });

  return res.json({
    period: `Tháng ${month}`,
    data: results,
    totalExpense: totalExpense,
    summary: {
      totalServices: Object.keys(results).length,
      totalRecords: Object.values(results).reduce((sum, item) => sum + item.count, 0)
    }
  });
}

// Helper function để tính toán chi phí theo năm
async function getYearlyExpenseReport(res, start, end, year, selectedServiceIds = []) {
  const services = getServicesByIds(selectedServiceIds);

  const monthlyData = {};
  const yearlyTotals = {};
  let grandTotal = 0;

  // Khởi tạo dữ liệu cho 12 tháng
  for (let month = 1; month <= 12; month++) {
    monthlyData[month] = {};
    for (const service of services) {
      monthlyData[month][service.name] = { totalPrice: 0, count: 0 };
    }
  }

  // Khởi tạo tổng năm cho từng dịch vụ
  for (const service of services) {
    yearlyTotals[service.name] = { totalPrice: 0, count: 0 };
  }

  // Sử dụng Promise.all để tối ưu hiệu suất
  const servicePromises = services.map(async (service) => {
    const aggregation = await service.model.aggregate([
      {
        $match: {
          [service.dateField]: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: { $month: `$${service.dateField}` },
          totalPrice: { $sum: `$${service.priceField}` },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    return { service: service.name, data: aggregation };
  });

  const serviceResults = await Promise.all(servicePromises);

  // Cập nhật dữ liệu theo tháng
  serviceResults.forEach(({ service, data }) => {
    data.forEach(item => {
      const month = item._id;
      monthlyData[month][service] = {
        totalPrice: item.totalPrice,
        count: item.count
      };
      yearlyTotals[service].totalPrice += item.totalPrice;
      yearlyTotals[service].count += item.count;
    });

    grandTotal += yearlyTotals[service].totalPrice;
  });

  // Format dữ liệu tháng
  const formattedMonthlyData = Object.keys(monthlyData).map(month => ({
    month: `Tháng ${month}`,
    monthNumber: parseInt(month),
    services: monthlyData[month],
    monthlyTotal: Object.values(monthlyData[month]).reduce((sum, service) => sum + service.totalPrice, 0)
  }));

  return res.json({
    period: `Năm ${year}`,
    monthlyData: formattedMonthlyData,
    yearlyTotals: yearlyTotals,
    grandTotal: grandTotal,
    summary: {
      totalServices: services.length,
      totalRecords: Object.values(yearlyTotals).reduce((sum, item) => sum + item.count, 0),
      averageMonthlyExpense: grandTotal / 12
    }
  });
}

module.exports = statisticsController;