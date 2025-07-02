const DomainServices = require("../models/services/domain/model");
const HostingPlans = require("../models/plans/hosting/model");
const SslPlans = require("../models/plans/ssl/model");

const populateDomainServiceForHosting = async (contracts) => {
  for (const contract of contracts) {
    for (const service of contract.services) {
      if (service.serviceType === 'hosting' && service.serviceId && service.serviceId.domainServiceId) {
        try {
          const domainService = await DomainServices.findById(service.serviceId.domainServiceId).select('name');
          if (domainService) {
            service.serviceId.domainServiceId = domainService;
          }
        } catch (error) {
          console.error('Error populating domain service for hosting:', error);
        }
      }
    }
  }
  return contracts;
};

const populateHostingPlanForDomain = async (contracts) => {
  for (const contract of contracts) {
    for (const service of contract.services) {
      if (service.serviceType === 'hosting' && service.serviceId && service.serviceId.hostingPlanId) {
        try {
          const hostingPlan = await HostingPlans.findById(service.serviceId.hostingPlanId).select('name');
          if (hostingPlan) {
            service.serviceId.hostingPlanId = hostingPlan;
          }
        } catch (error) {
          console.error('Error populating hosting plan for domain:', error);
        }
      }
    }
  }
  return contracts;
};

const populateSslPlanForDomain = async (contracts) => {
  for (const contract of contracts) {
    for (const service of contract.services) {
      if (service.serviceType === 'ssl' && service.serviceId && service.serviceId.sslPlanId) {
        try {
          const sslPlan = await SslPlans.findById(service.serviceId.sslPlanId).select('name');
          if (sslPlan) {
            service.serviceId.sslPlanId = sslPlan;
          }
        } catch (error) {
          console.error('Error populating ssl plan for domain:', error);
        }
      }
    }
  }
  return contracts;
};

module.exports = {
  populateDomainServiceForHosting,
  populateHostingPlanForDomain,
  populateSslPlanForDomain
}; 