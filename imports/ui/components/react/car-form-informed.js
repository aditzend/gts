import React from 'react';
import {
    Form,
    Text
} from 'informed';

const validate = value => {
    return !value || value.length < 5 ? 'Field must be longer than five characters' : null;
}

class CarForm extends React.Component {
    constructor(props) {
        super(props);

        // Remember! This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
        this.setFormApi = this.setFormApi.bind(this);
    }

    handleClick() {
        console.log(this.formApi.getState());
    }

    setFormApi(formApi) {
        this.formApi = formApi;
    }

    // validate(value) {
    //     !value || value.length < 6 ? 'Este campo debe contener 6 caracteres' : null
    // }

 

    render() {
        return (
            <div>
                <Form>
                    {({ formState }) => (
                        <div>
                            <Text field="plate" validateOnBlur validate={validate} className="form-control plate" />
                            <button type="submit">Submit</button>
                            <label>Values:</label>
                            <code>
                                {JSON.stringify(formState.errors)}
                            </code>
                        </div>
                    )}
                </Form>
            </div>
        );
    }
}

export default CarForm

// export default class CarForm extends React.Component {
//     render() {
//         return ( 
//             FormComponent
//         )
//     }
// }