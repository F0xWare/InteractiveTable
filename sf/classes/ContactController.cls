public with sharing class ContactController {
    @AuraEnabled
    public static List<Contact>  getContacts() {
        try{
            List<Contact> lstContacts = [SELECT FirstName, LastName, Email FROM Contact LIMIT 10];
            return lstContacts;
        } 
        catch(Exception e){
            System.debug(e.getMessage());
            throw e;
        }
    }

    @AuraEnabled
    public static Contact createContact(String cFirstName, String cLastName, String cEmail){
        try{
                Contact newContact = new Contact(
                    FirstName = cFirstName,
                    LastName = cLastName,
                    Email = cEmail
                );
            
                insert newContact;
                return newContact;  
        } 
        catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Contact updateContact(String cId, String cFirstName, String cLastName, String cEmail){
        try{
            Contact editedContact = new Contact(Id = cId);

            editedContact.FirstName = cFirstName;
            editedContact.LastName = cLastName;
            editedContact.Email = cEmail;

            update editedContact;
            return editedContact;
        } 
        catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Contact deleteContact(String contactId){
        try{
            Contact contactToDelete = new Contact(Id = contactId);
            
            delete contactToDelete;
            return contactToDelete;
        } 
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}


