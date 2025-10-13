# POWERGRID AI Helpdesk - Setup Guide

## Test Users

For the hackathon, you can create these test users manually in your Supabase authentication dashboard:

1. **Employee User**
   - Email: employee@powergrid.com
   - Password: employee123
   - Role: employee

2. **IT Support User**
   - Email: it@powergrid.com
   - Password: it123
   - Role: it_support

3. **Admin User**
   - Email: admin@powergrid.com
   - Password: admin123
   - Role: it_admin

## Setting up User Roles

After creating the users in the authentication dashboard, you need to set up their profiles in the database:

1. Go to your Supabase project dashboard
2. Navigate to the "Table Editor"
3. Find the "profiles" table
4. Insert the following records:

### Employee Profile
```sql
INSERT INTO profiles (id, employee_id, full_name, email, department, role)
VALUES ('[USER_ID_FROM_AUTH]', 'EMP001', 'John Employee', 'employee@powergrid.com', 'Engineering', 'employee');
```

### IT Support Profile
```sql
INSERT INTO profiles (id, employee_id, full_name, email, department, role)
VALUES ('[USER_ID_FROM_AUTH]', 'IT001', 'Sarah IT Support', 'it@powergrid.com', 'IT', 'it_support');
```

### Admin Profile
```sql
INSERT INTO profiles (id, employee_id, full_name, email, department, role)
VALUES ('[USER_ID_FROM_AUTH]', 'ADM001', 'Mike Administrator', 'admin@powergrid.com', 'IT', 'it_admin');
```

## Inserting Sample Data

As an admin user, you can insert sample data by:

1. Logging in as the admin user
2. Navigating to the dashboard
3. Clicking the "Insert Sample Data" button in the header

This will populate the knowledge base with sample articles.

## Features Implemented

1. **Auto Ticket Creation**: When the AI determines an issue requires a ticket, it automatically pre-fills a ticket form for the user
2. **Knowledge Base**: Sample articles for common IT issues
3. **User Roles**: Employee, IT Support, and Admin roles with appropriate permissions
4. **AI Chat**: Simplified AI classification without external dependencies

## Testing the System

1. Log in as the employee user
2. Describe an issue in the chat (e.g., "I need to reset my password")
3. The system should either provide a solution or suggest creating a ticket
4. If a ticket is suggested, review the pre-filled form and submit it
5. Switch to the IT user to view and resolve tickets
6. Switch to the admin user to manage the knowledge base