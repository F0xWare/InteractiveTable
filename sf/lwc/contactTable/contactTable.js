import { LightningElement } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';
import updateContact from '@salesforce/apex/ContactController.updateContact';
import createContact from '@salesforce/apex/ContactController.createContact'; 
import deleteContact from '@salesforce/apex/ContactController.deleteContact';

export default class ContactTable extends LightningElement {

    isModalOpen = false;
    recordId;
    lstContacts = [];
    modalTitle = "";
    actionName="";
    
    actions = [
        {
            label: "Edit",
            name: "edit"
        },
        {
            label: "Delete",
            name: "delete",
        }
    ];
    
    columns = [
        { label: "Id", fieldName: "Id" },
        { label: "First Name", fieldName: "FirstName" },
        { label: "Last Name", fieldName: "LastName" },
        { label: "Email", fieldName: "Email" },
        {
            type: "action",
            typeAttributes: {rowActions: this.actions}
        }
    ];

    async connectedCallback() {
        try {
            await this.obtainContacts();
        }
        catch (error) {
            console.log("Ocurrió un error en el connectedCallback", error);
        }
    }

    handleRowActions (event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName){
            case 'edit':
                this.handleOpenModal();
                this.modalTitle = "Edit";
                this.actionName = 'edit';
                break;

            case 'delete':
                this.handleDelete(row.Id);
                break;

            default:
                // No hacer nada
        }
    }

    handleOpenModal () {        
        this.isModalOpen = true;
    }
    
    handleCloseModal () {
        this.isModalOpen = false;
    }

    handleNew(){
        this.recordId = null;
        this.modalTitle = 'New Contact';
        this.actionName = 'new'
        this.handleOpenModal();
    }

    handleSend(event){

        const newLstContacts = event.detail;

        switch (this.actionName) {
            
            case 'edit':
                this.handleEdit(
                    newLstContacts.Id, 
                    newLstContacts.FirstName, 
                    newLstContacts.LastName, 
                    newLstContacts.Email);
                this.refreshData();
                this.handleCloseModal();
                break;

            case 'new': 
                this.handleCreateContact(
                    newLstContacts.FirstName, 
                    newLstContacts.LastName, 
                    newLstContacts.Email);
                this.handleCloseModal();
                break;

            default:
                // no hacer nada
        }
        
        
    }

    async handleEdit(Id, FirstName, LastName, Email){
        try {
            await updateContact( {
                IdContact : Id, 
                FirstNameC : FirstName, 
                LastNameC : LastName, 
                EmailC : Email})
        } catch (error) {
            console.log("Ocurrió un error:", error);
        }
       
    }

    async handleCreateContact(FirstName, LastName, Email) {

        try {
            await createContact({
                FirstName : FirstName, 
                LastName:  LastName, 
                Email : Email});
        } catch (error) {
            console.log(error);
        }
        

    }

    async handleDelete(Id){
        try {
            await deleteContact({
                contactId : Id
            });
        } catch (error) {
            console.log("Ocurrió un error:", error);
        }
    }

    mapFields(contactList) {
        const data = contactList.map(contact => {
            const record = {
                "Id": contact.Id,
                "FirstName": contact.FirstName,
                "LastName": contact.LastName,
                "Email": contact.Email};
                return record;
        });
        return data;
    }

    async obtainContacts() {
        try {
            const contacts = await getContacts();
            this.lstContacts = this.mapFields(contacts);
        }
        catch (error) {
            console.log('Ocurrió un error al obtener los leads', error);
        }
    };

    // No funciona 😥
    refreshData(){
        refreshApex(this.refreshTable);
    }

}