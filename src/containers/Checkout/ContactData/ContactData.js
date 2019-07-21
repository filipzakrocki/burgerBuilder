import React from 'react';
import Button from '../../../components/UI/Button/Button'
import classes from './ContactData.css'
import axios from '../../../axios-orders'
import Spinner from '../../../components/UI/Spinner/Spinner'

class ContactData extends React.Component {
    
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: '',
        },
        loading: false,
        
    };

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({loading: true});

        const order = {
            orderTime: new Date(),
            ingredients: this.props.ingredients,
            price: this.props.price,
            kcal: this.props.kcal,
            customer:  {
                name: 'Filip Zakrocki',
                address: {
                    street: 'teststreet 1/2',
                    city: 'London',
                    zipCode: '123456'
                },
                email: 'test@test.com',
                delivery: 'true'
            }
        }
        axios.post('/orders.json', order)
        .then(response => {
            this.setState({loading: false, purchasing: false})
            this.props.history.push('/')
        })
        .catch(error => {
            this.setState({loading: false, purchasing: false})

        } );
    }
    
    render() {
        let form = (<form>
                    <input type='text' name='name' placeholder='Your Name'/>
                    <input type='email' name='email' placeholder='Your email'/>
                    <input type='text' name='street' placeholder='Your street'/>
                    <input type='text' name='postal' placeholder='Your Zip Code'/>
                    <Button clicked={this.orderHandler} btnType='Success'>ORDER</Button>
                </form>)
        if (this.state.loading) {
            form = <Spinner/>
        } 
        
        return(
        
            
            <div className={classes.ContactData}>
                <h4>Enter your contact data:</h4>
                {form}
            </div>
        );
    }
}

export default ContactData;