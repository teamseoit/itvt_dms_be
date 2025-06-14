const mongoose = require('mongoose');
const { updateDomainServicesStatus, getExpiringDomains, getExpiredDomains, sendDomainNotifications } = require('../src/utils/domainStatusUpdater');

// Kết nối database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Hàm chính để cập nhật status
const main = async () => {
  try {
    await connectDB();
    
    console.log('Starting domain status update...');
    
    // Lấy tham số từ command line
    const args = process.argv.slice(2);
    const sendNotifications = args.includes('--send-email') || args.includes('-e');
    const onlyNotifications = args.includes('--notifications-only') || args.includes('-n');
    
    if (onlyNotifications) {
      console.log('Running notifications only...');
      const notificationResult = await sendDomainNotifications();
      console.log('Notification result:', notificationResult);
    } else {
      // Cập nhật status tất cả domain
      const updateResult = await updateDomainServicesStatus(sendNotifications);
      console.log('Update result:', updateResult);
    }
    
    // Lấy danh sách domain sắp hết hạn
    const expiringDomains = await getExpiringDomains(30);
    console.log(`Found ${expiringDomains.length} domains expiring in 30 days`);
    
    // Lấy danh sách domain đã hết hạn
    const expiredDomains = await getExpiredDomains();
    console.log(`Found ${expiredDomains.length} expired domains`);
    
    // Hiển thị chi tiết domain sắp hết hạn
    if (expiringDomains.length > 0) {
      console.log('\nDomains expiring soon:');
      expiringDomains.forEach(domain => {
        console.log(`- ${domain.name} (${domain.customer?.fullName || 'Unknown'}) - ${domain.statusText}`);
      });
    }
    
    // Hiển thị chi tiết domain đã hết hạn
    if (expiredDomains.length > 0) {
      console.log('\nExpired domains:');
      expiredDomains.forEach(domain => {
        console.log(`- ${domain.name} (${domain.customer?.fullName || 'Unknown'}) - ${domain.statusText}`);
      });
    }
    
    console.log('\nDomain status update completed successfully!');
    
  } catch (error) {
    console.error('Error in main function:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

// Hiển thị hướng dẫn sử dụng
const showUsage = () => {
  console.log(`
Usage: node scripts/updateDomainStatus.js [options]

Options:
  --send-email, -e          Send email notifications after update
  --notifications-only, -n  Only send notifications without updating status
  --help, -h               Show this help message

Examples:
  node scripts/updateDomainStatus.js                    # Update status only
  node scripts/updateDomainStatus.js --send-email       # Update status and send emails
  node scripts/updateDomainStatus.js --notifications-only # Send emails only
  `);
};

// Kiểm tra tham số help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  showUsage();
  process.exit(0);
}

// Chạy script
main(); 