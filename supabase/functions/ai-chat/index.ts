import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Enhanced classification logic with detailed solutions
    const classifyIssue = (message: string) => {
      const lowerMessage = message.toLowerCase();
      
      // Category detection
      let category: string = "other";
      if (lowerMessage.includes("vpn") || lowerMessage.includes("network") || lowerMessage.includes("internet")) {
        category = "network";
      } else if (lowerMessage.includes("password") || lowerMessage.includes("account") || lowerMessage.includes("login")) {
        category = "account";
      } else if (lowerMessage.includes("email") || lowerMessage.includes("mail")) {
        category = "email";
      } else if (lowerMessage.includes("printer") || lowerMessage.includes("print")) {
        category = "printer";
      } else if (lowerMessage.includes("software") || lowerMessage.includes("application") || lowerMessage.includes("app")) {
        category = "software";
      } else if (lowerMessage.includes("computer") || lowerMessage.includes("laptop") || lowerMessage.includes("hardware")) {
        category = "hardware";
      }
      
      // Priority detection
      let priority: string = "medium";
      if (lowerMessage.includes("urgent") || lowerMessage.includes("emergency") || lowerMessage.includes("asap")) {
        priority = "urgent";
      } else if (lowerMessage.includes("important") || lowerMessage.includes("critical")) {
        priority = "high";
      } else if (lowerMessage.includes("minor") || lowerMessage.includes("small")) {
        priority = "low";
      }
      
      // Check if it's a common issue
      const commonIssues = [
        "password reset", "vpn connection", "printer not working", "email setup", 
        "software installation", "login issue", "internet connection"
      ];
      
      const isCommon = commonIssues.some(issue => lowerMessage.includes(issue));
      
      // Generate detailed solution using enhanced rule-based approach
      let solution = "";
      if (isCommon) {
        solution = generateDetailedSolution(category, message);
      }
      
      return {
        category,
        priority,
        isCommon,
        solution: solution || "I'll need to create a ticket for this issue so our IT team can help you.",
        kbQuery: category
      };
    };

    // Enhanced rule-based solution generator with detailed steps
    const generateDetailedSolution = (category: string, message: string) => {
      const lowerMessage = message.toLowerCase();
      
      if (category === "account" && lowerMessage.includes("password")) {
        return `Here's a step-by-step guide to reset your password:

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
• Contact IT support if you continue to have issues - we can manually reset your password`;
      }
      
      if (category === "network" && (lowerMessage.includes("vpn") || lowerMessage.includes("internet"))) {
        return `Here's how to troubleshoot your network connection issues:

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

If these steps don't resolve the issue, our network team will need to investigate further.`;
      }
      
      if (category === "printer" && lowerMessage.includes("print")) {
        return `Here's a comprehensive guide to fix printer issues:

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

If the printer still isn't working, we may need to check for hardware issues.`;
      }
      
      if (category === "email" && (lowerMessage.includes("email") || lowerMessage.includes("mail"))) {
        return `Here's how to resolve common email issues:

1. Check your internet connection:
   - Ensure you have stable internet access
   - Try accessing other online services to confirm connectivity

2. Verify login credentials:
   - Double-check your email address and password
   - Ensure CAPS LOCK is off when entering your password
   - If you've recently changed your password, use the new one

3. Email client setup:
   - For Outlook: File > Account Settings > Account Settings > Repair
   - For web browser: Clear cache and cookies, then try again
   - Check if two-factor authentication is enabled and complete any required steps

4. Storage and settings:
   - Check if your mailbox is full (delete unnecessary emails)
   - Verify email filters aren't accidentally moving messages
   - Check spam/junk folders for missing emails

If issues persist, we can help reconfigure your email settings.`;
      }
      
      if (category === "software" && (lowerMessage.includes("software") || lowerMessage.includes("install"))) {
        return `Here's how to resolve software installation issues:

1. Check system requirements:
   - Verify your computer meets the minimum requirements for the software
   - Check available disk space (most software requires 1-2GB free space)

2. Prepare for installation:
   - Close all unnecessary programs to free up system resources
   - Run the installer as an administrator (right-click > Run as administrator)
   - Temporarily disable antivirus software during installation

3. Installation process:
   - Download the software from official sources only
   - Right-click the installer and select "Run as administrator"
   - Follow the installation wizard, accepting default settings unless you have specific requirements
   - Restart your computer if prompted

4. Post-installation:
   - Check for software updates after installation
   - Register the software with your license key if required
   - Configure settings according to your preferences

If you encounter specific error messages, note them down for our IT team.`;
      }
      
      // Generic solution for other categories
      return `Based on your description, this appears to be a ${category} issue. 
        
Here are general troubleshooting steps:
1. Restart your computer to refresh system resources
2. Check for any error messages and note them down
3. Ensure all cables are securely connected
4. Check our Knowledge Base for articles related to "${category}"
5. If you're unable to resolve it yourself, I can create a support ticket for you with detailed information about your issue.`;
    };

    const classification = classifyIssue(message);

    // Search knowledge base
    const { data: kbArticles } = await supabaseClient
      .from('knowledge_base')
      .select('*')
      .eq('category', classification.category)
      .limit(3);

    const response = {
      classification,
      kbArticles: kbArticles || [],
      suggestedAction: classification.isCommon && classification.solution ? 'show_solution' : 'create_ticket',
      solution: classification.solution
    };

    // Log the chat message
    await supabaseClient
      .from('chat_messages')
      .insert({
        user_id: userId,
        message: message,
        response: JSON.stringify(response)
      });

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: unknown) {
    console.error('Error in ai-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        classification: {
          category: 'other',
          priority: 'medium',
          isCommon: false
        },
        suggestedAction: 'create_ticket'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});