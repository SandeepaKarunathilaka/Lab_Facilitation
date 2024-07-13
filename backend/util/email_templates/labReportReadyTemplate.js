const labReportReadyTemplate = (userName, reportLink) => `
<!DOCTYPE html>
<html>
<head>
    <title>Lab Report Ready</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .container { padding: 20px; }
        .report-ready { color: #333366; }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="report-ready">Your Lab Report is Ready, ${userName}!</h1>
        <p>Hi ${userName},</p>
        <p>We are pleased to inform you that your lab report is now ready and available for viewing.</p>
        <p>Please click on the link below to view your report:</p>
        <p><a href="${reportLink}">View My Lab Report</a></p>
        <p>If you have any questions or require further assistance, please reply to this email or contact our support team directly.</p>
        <br />
        <p>Thank you for choosing our services,</p>
        <p>The Lab Team</p>
    </div>
</body>
</html>
`;

module.exports = labReportReadyTemplate;
