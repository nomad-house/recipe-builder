import { getStore } from './utils';

export const logIn = ({ username = 'admin', password = 'password' } = {}) => {
  // Manually log the user in
  cy.location('pathname').then(pathname => {
    if (pathname === 'blank') {
      cy.visit('/');
    }
  });
  getStore().then(store => store.dispatch('auth/logIn', { username, password }));
};

Cypress.Commands.add('logIn', logIn);
