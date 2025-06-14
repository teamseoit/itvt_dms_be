const Contract = require("./model");
const DomainServices = require("../services/domain/model");
const EmailServices = require("../services/email/model");
const { createContractForServices } = require("./service");

exports.generateNextContractCode = async () => {
  const latest = await Contract.findOne().sort({ createdAt: -1 });
  const lastCode = latest?.contractCode || "HD0000";
  const lastNum = parseInt(lastCode.replace("HD", "")) || 0;
  const nextNum = lastNum + 1;
  return "HD" + nextNum.toString().padStart(4, "0");
};

exports.createContractForUnlinkedServices = async (customerId, exportVAT = true, createdBy = null) => {
  const contracts = await Contract.find({ customer: customerId });
  const linkedIds = new Set();
  contracts.forEach(ct => {
    ct.services.forEach(s => linkedIds.add(String(s.serviceId)));
  });

  const toLink = [];

  const domain = await DomainServices.find({ customer_id: customerId });
  domain.forEach(s => {
    if (!linkedIds.has(String(s._id))) toLink.push({ type: "domain", id: s._id });
  });

  const email = await EmailServices.find({ customer_id: customerId });
  email.forEach(s => {
    if (!linkedIds.has(String(s._id))) toLink.push({ type: "email", id: s._id });
  });

  if (!toLink.length) return null;

  return await createContractForServices(customerId, toLink, exportVAT, createdBy);
};