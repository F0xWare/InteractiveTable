import { LightningElement, api } from 'lwc';

export default class ContactForm extends LightningElement {

    fieldValues = [];
    @api columns = [];
    @api row = [];
    @api modalTitle;

    connectedCallback(){
        for (const col of this.columns){
            if (col.fieldName !== "Id" && col.type !== 'action') {
                this.fieldValues.push({
                    ...col, 
                    value: this.row[col.fieldName]
                })
            }
        }
    }
    
    handleDataFieldChange(event){
        const fieldName = event.target.dataset.id;
        const fieldValue = event.target.value;
        const row = {...this.row};
        
        row[fieldName] = fieldValue;
        this.row = row;
    }

    handleSave(){
        const formData =  this.row;
        const saveEvenet = new CustomEvent('save', 
            {
                detail: formData
            }
        );
        
        this.dispatchEvent(saveEvenet);
    }
    
    handleClose(){
        const closeForm =  new CustomEvent('close',
            {
                message: "Close the form"
            }
        );
        
        this.dispatchEvent(closeForm);
    }


}