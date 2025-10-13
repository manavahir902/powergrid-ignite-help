import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type KnowledgeBaseInsert = Database["public"]["Tables"]["knowledge_base"]["Insert"];

// Sample knowledge base articles
const sampleKBArticles: KnowledgeBaseInsert[] = [
  {
    title: "Resetting Your Password",
    content: `If you've forgotten your password or need to reset it for security reasons, follow these steps:

1. Navigate to the login page and click on the "Forgot Password" link
2. Enter your registered email address in the provided field
3. Check your email inbox (including spam/junk folders) for a password reset message
4. Click on the password reset link in the email
5. Create a strong new password (at least 8 characters with uppercase, lowercase, and numbers)
6. Confirm your new password by typing it again
7. Click "Reset Password" to complete the process

Troubleshooting tips:
• If you don't receive the email within 5 minutes, verify the email address you entered
• Ensure your spam filter isn't blocking emails from our domain
• Contact IT support if you continue to have issues - we can manually reset your password

Security Tip: Use a strong password with at least 8 characters including uppercase, lowercase, numbers, and symbols.`,
    category: "account",
    keywords: ["password", "reset", "forgot", "login", "security"],
  },
  {
    title: "VPN Connection Issues",
    content: `If you're having trouble connecting to the corporate VPN, try these solutions:

Step-by-Step Troubleshooting:
1. Check physical connections:
   - Ensure your ethernet cable is securely connected (if using wired connection)
   - Verify WiFi is enabled and connected to the correct network

2. Basic troubleshooting:
   - Try accessing other websites to confirm general internet connectivity
   - Restart your computer to refresh network settings
   - If using VPN, disconnect and reconnect to the VPN service

3. Advanced steps:
   - Flush your DNS cache by opening Command Prompt and typing: ipconfig /flushdns
   - Reset your network settings: netsh winsock reset (then restart your computer)
   - Check if there are any known network outages in your area

4. For remote employees:
   - Ensure you're using the correct VPN server address
   - Verify your credentials are correct
   - Check if multi-factor authentication is required

If the above steps don't work:
- Update your VPN client to the latest version
- Reinstall the VPN client
- Contact IT support with specific error messages`,
    category: "network",
    keywords: ["vpn", "connection", "remote", "network", "access"],
  },
  {
    title: "Printer Not Responding",
    content: `If your printer isn't responding or printing documents, follow these troubleshooting steps:

1. Check physical connections:
   - Ensure the printer is powered on (check the power light)
   - Verify all cables are securely connected (USB, ethernet, or WiFi)
   - Check that the printer has sufficient paper and ink/toner

2. Clear any paper jams:
   - Open the printer and carefully remove any stuck paper
   - Check all paper paths and remove any debris

3. Restart devices:
   - Turn off the printer, wait 10 seconds, then turn it back on
   - Restart your computer to refresh printer connections
   - Restart the print spooler service (Windows: Services > Print Spooler > Restart)

4. Update drivers:
   - Visit the printer manufacturer's website
   - Download and install the latest drivers for your specific model
   - Remove and re-add the printer in your system settings

If issues persist, contact IT support with the printer model and specific error messages.`,
    category: "printer",
    keywords: ["printer", "printing", "not responding", "drivers", "paper jam"],
  },
  {
    title: "Email Setup for Microsoft Outlook",
    content: `To set up your corporate email in Microsoft Outlook:

For Office 365/Microsoft 365:
1. Open Outlook
2. Click "Add Account"
3. Enter your full email address
4. Enter your password
5. Click "Connect"

For IMAP/POP settings:
Incoming Mail Server (IMAP): imap.yourcompany.com
Port: 993 (SSL required)
Username: your full email address
Password: your email password

Outgoing Mail Server (SMTP): smtp.yourcompany.com
Port: 587 (TLS/STARTTLS)
Authentication: Yes
Username: your full email address
Password: your email password

Troubleshooting:
- Ensure SSL/TLS encryption is enabled
- Check if two-factor authentication is affecting access
- Contact IT if you continue to have issues

Additional Tips:
- Keep your Outlook updated to the latest version
- Restart Outlook after making configuration changes
- Check your spam/junk folders for important messages`,
    category: "email",
    keywords: ["email", "outlook", "setup", "imap", "smtp", "configuration"],
  },
  {
    title: "Software Installation Guide",
    content: `To install approved software on your work computer:

1. Check the software approval list:
   - Visit the company software portal
   - Search for the software you need
   - Verify it's approved for your department

2. Request installation:
   - Submit a software request through the portal
   - Provide business justification
   - Wait for IT approval (usually within 24 hours)

3. Self-installation (if permitted):
   - Download from approved sources only
   - Run the installer as an administrator (right-click > Run as administrator)
   - Temporarily disable antivirus software during installation
   - Follow any specific installation instructions

4. Post-installation:
   - Register the software if required
   - Activate with provided licenses
   - Report any issues to IT support

Note: Installing unauthorized software is prohibited and may result in security incidents.

Troubleshooting Installation Issues:
- Check system requirements before installing
- Ensure sufficient disk space is available
- Close all other programs during installation
- Restart your computer if prompted`,
    category: "software",
    keywords: ["software", "installation", "install", "approved", "license"],
  },
  {
    title: "Internet Connection Troubleshooting",
    content: `Having trouble connecting to the internet? Try these steps:

1. Check physical connections:
   - Ensure your ethernet cable is securely connected
   - Verify WiFi is enabled and connected to the correct network
   - Check if other devices can connect to the same network

2. Basic troubleshooting:
   - Restart your computer
   - Restart your router/modem (unplug for 30 seconds, then plug back in)
   - Try accessing different websites to confirm the issue scope

3. Network settings:
   - Flush DNS cache: Open Command Prompt and type "ipconfig /flushdns"
   - Renew IP address: "ipconfig /renew"
   - Reset network settings: "netsh winsock reset" (then restart computer)

4. Browser-specific issues:
   - Clear browser cache and cookies
   - Disable browser extensions temporarily
   - Try a different browser

If none of these steps work, contact IT support with details about:
- When the issue started
- Error messages you're seeing
- Which websites/services are affected`,
    category: "network",
    keywords: ["internet", "connection", "wifi", "ethernet", "troubleshooting"],
  },
  {
    title: "Computer Running Slow",
    content: `Is your computer running slower than usual? Here are some solutions:

1. Basic maintenance:
   - Restart your computer to clear temporary files
   - Close unnecessary programs and browser tabs
   - Check for Windows updates and install them

2. Disk cleanup:
   - Run Disk Cleanup utility (search for "Disk Cleanup" in Start menu)
   - Remove temporary files, recycle bin contents, and old system files
   - Empty your browser cache regularly

3. Performance optimization:
   - Disable startup programs you don't need (Task Manager > Startup tab)
   - Run a virus/malware scan
   - Check available disk space (ensure at least 15% free space)

4. Hardware considerations:
   - Check if your computer meets software requirements
   - Consider adding more RAM if you frequently run multiple programs
   - Defragment your hard drive (not needed for SSDs)

If performance issues persist, contact IT support for hardware diagnostics.`,
    category: "hardware",
    keywords: ["computer", "slow", "performance", "speed", "maintenance"],
  },
];

// Sample user profiles
const sampleUsers = [
  {
    employee_id: "EMP001",
    full_name: "John Employee",
    email: "john.employee@powergrid.com",
    department: "Engineering",
    role: "employee" as const,
  },
  {
    employee_id: "IT001",
    full_name: "Sarah IT Support",
    email: "sarah.it@powergrid.com",
    department: "IT",
    role: "it_support" as const,
  },
  {
    employee_id: "ADM001",
    full_name: "Mike Administrator",
    email: "mike.admin@powergrid.com",
    department: "IT",
    role: "it_admin" as const,
  },
];

export const insertSampleData = async () => {
  try {
    // Insert sample knowledge base articles
    const { error: kbError } = await supabase
      .from("knowledge_base")
      .insert(sampleKBArticles);

    if (kbError) {
      console.error("Error inserting KB articles:", kbError);
    } else {
      console.log("Sample KB articles inserted successfully");
    }

    console.log("Sample data insertion completed");
  } catch (error) {
    console.error("Error inserting sample data:", error);
  }
};

export const createTestUsers = async () => {
  try {
    // Note: In a real application, you would create actual auth users
    // For this demo, we're just showing how the data structure would work
    console.log("Test users would be created here");
    console.log("Sample users:", sampleUsers);
  } catch (error) {
    console.error("Error creating test users:", error);
  }
};