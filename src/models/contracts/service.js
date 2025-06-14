const Contract = require("./model");
const { generateNextContractCode } = require("./helper");

const DomainServices = require("../services/domain/model");
const EmailServices = require("../services/email/model");

exports.createContractForServices = async (
  customerId,
  serviceInputs,
  exportVAT = true,
  createdBy = null
) => {
  const allServices = [];
  let totalAmount = 0;

  for (const svc of serviceInputs) {
    let model, planField;

    if (svc.type === "domain") {
      model = DomainServices;
      planField = "domainPlanId";
    } else if (svc.type === "email") {
      model = EmailServices;
      planField = "emailPlanId";
    } else continue;

    const serviceDoc = await model.findById(svc.id).populate({ path: planField });
    if (!serviceDoc) continue;

    const price = serviceDoc[planField]?.retailPrice || 0;
    allServices.push({
      serviceType: svc.type,
      serviceTypeRef: model.modelName,
      serviceId: svc.id,
      name: serviceDoc.name,
      price,
    });

    totalAmount += price;
  }

  const vatRate = exportVAT ? 0.1 : 0;
  const vatAmount = totalAmount * vatRate;
  const grandTotal = totalAmount + vatAmount;

  const contractCode = await generateNextContractCode();

  return await Contract.create({
    customer: customerId,
    contractCode,
    exportVAT,
    services: allServices,
    financials: {
      totalAmount,
      vatRate,
      vatAmount,
      grandTotal,
      amountPaid: 0,
      amountRemaining: grandTotal,
      isFullyPaid: false,
    },
    createdBy,
  });
};
