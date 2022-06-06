import axios from 'axios';
import { showAlert } from './alerts';
export const bookTour = async (tourID) => {
  try {
    const stripe = Stripe(
      `pk_test_51L7BSQAAxAOnpsobTEhxpDzeNloMJIFNN8vMAvyWY2yoiCoVIKJKJEWQY8qTW1uQ7dqq47w554txO039Z71O9ByM00JzeBJvAg`
    );
    // 1) Get the session from the server(API)
    const session =
      await axios.get(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourID}
    `);
    // 2) Create checkout form and charge the credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    console.log(error);
    showAlert('error', error.message);
  }
};
