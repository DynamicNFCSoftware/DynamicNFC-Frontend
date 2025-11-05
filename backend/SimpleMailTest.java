import javax.mail.*;
import javax.mail.internet.*;
import java.util.Properties;

public class SimpleMailTest {
    public static void main(String[] args) {
        // Gmail SMTP settings
        String host = "smtp.gmail.com";
        String port = "587";
        String username = "dynamicnfc3@gmail.com";
        String password = "qifbvdqzavdhuoyj"; // App Password
        
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", host);
        props.put("mail.smtp.port", port);
        
        Session session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });
        
        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse("dynamicnfc3@gmail.com"));
            message.setSubject("Test Email from Java");
            message.setText("This is a test email to verify Gmail App Password configuration!");
            
            Transport.send(message);
            System.out.println("✅ Email sent successfully!");
            
        } catch (MessagingException e) {
            System.out.println("❌ Email failed:");
            e.printStackTrace();
        }
    }
}