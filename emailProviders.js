const emailProviders = [
    "1und1",
    "AOL",
    "DebugMail.io",
    "DynectEmail",
    "FastMail",
    "GandiMail",
    "Gmail",
    "Godaddy",
    "GodaddyAsia",
    "GodaddyEurope",
    "hot.ee",
    "Hotmail",
    "iCloud",
    "mail.ee",
    "Mail.ru",
    "Mailgun",
    "Mailjet",
    "Mandrill",
    "Naver",
    "Postmark",
    "QQ",
    "QQex",
    "SendCloud",
    "SendGrid",
    "SES",
    "Sparkpost",
    "Yahoo",
    "Yandex",
    "Zoho"
  ];

  exports.selectEmailProvider= (email) => {
    let emailProvider = '';
    emailProviders.forEach( provider => {
        if (email.includes(provider.toLowerCase())) {
            emailProvider = provider;
        }
    });
    return emailProvider !== ''? emailProvider : new ErrorEvent('Invalid', { message: 'email provider not supported'});
  }