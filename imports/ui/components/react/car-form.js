// import React from 'react';
// import { Form } from 'react-advanced-form';
// import { Input, Button } from 'react-advanced-form-addons';

// export default class SyncValidation extends React.Component {
//     registerUser = ({ serialized }) => {
//         alert(JSON.stringify(serialized, null, 2));

//         /* Perform async request with the serialized data */
//         return new Promise(resolve => resolve());
//     }

//     render() {
//         return (
//             <Form action={this.registerUser}>
//                 <Input
//                     name="userEmail"
//                     type="email"
//                     label="E-mail"
//                     required />
//                 <Input
//                     name="userPassword"
//                     type="password"
//                     label="Password"
//                     required />
//                 <Input
//                     name="confirmPassword"
//                     type="password"
//                     label="Confirm password"
//                     required
//                     skip />

//                 <Button primary>Register</Button>
//             </Form>
//         );
//     }
// }