import React from 'react';
import { createField, fieldPresets } from 'react-advanced-form'
// import { Input, Button } from 'react-advanced-form-addons';

const CarForm = (props) => {
    const { fieldProps, fieldState } = props
    const { errors } = fieldState

    return (
        <div className="input">
            <input {...fieldProps} />

            {errors && errors.map((error) => (
                <div className="text-error">{error}</div>
            ))}
        </div>
    )
}

export default createField(fieldPresets.input)(CarForm)


{/* <Form action={this.registerUser}>
    <Input
        name="userEmail"
        type="email"
        label="E-mail"
        required />
    <Input
        name="userPassword"
        type="password"
        label="Password"
        required />
    <Input
        name="confirmPassword"
        type="password"
        label="Confirm password"
        required
        skip />

    <Button primary>Register</Button>
</Form> */}