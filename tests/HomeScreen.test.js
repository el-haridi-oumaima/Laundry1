import React from 'react';
import { render, fireEvent } from '@testing-library/react-native'; 
import HomeScreen from '../screens/HomeScreen'; 

// Création d'une fonction mock pour simuler la navigation 
const mockNavigate = jest.fn(); 

// Mock du hook useNavigation de React Navigation
// On remplace useNavigation pour qu'il retourne un objet contenant notre fonction mockNavigate
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate, // fonction simulant la méthode navigate de la navigation
  }),
}));

// Avant chaque test, on remet à zéro notre mockNavigate pour éviter les interférences entre tests
// On mock aussi globalement la fonction fetch utilisée dans HomeScreen pour récupérer des données distantes
beforeEach(() => {
  mockNavigate.mockClear(); // remise à zéro des appels faits sur mockNavigate
  global.fetch = jest.fn(() => // mock de fetch qui retourne une promesse résolue avec un json vide (tableau vide)
    Promise.resolve({
      json: () => Promise.resolve([]), // simule une réponse JSON vide (aucune donnée)
    })
  );
});

// Après chaque test, on nettoie tous les mocks et supprime le mock global de fetch
afterEach(() => {
  jest.clearAllMocks(); // supprime tous les mocks utilisés (mockNavigate, fetch, etc.)
  delete global.fetch;   // supprime le mock fetch du scope global
});

// Suite de tests pour le composant HomeScreen
describe('HomeScreen', () => {
  it('affiche le bouton Book Now et navigue avec les bons paramètres quand on clique dessus', () => {
    // On rend le composant HomeScreen pour le tester
    const { getAllByText } = render(<HomeScreen />);

    // On récupère tous les boutons contenant le texte 'Book Now' (insensible à la casse grâce à /i)
    const bookNowButtons = getAllByText(/Book Now/i);

    // Vérifie qu'il y a au moins un bouton 'Book Now' affiché
    expect(bookNowButtons.length).toBeGreaterThan(0);

    // Simule un clic sur le premier bouton 'Book Now'
    fireEvent.press(bookNowButtons[0]);

    // Vérifie que la fonction navigate a été appelée exactement une fois
    expect(mockNavigate).toHaveBeenCalledTimes(1);

    // Vérifie que navigate a été appelée avec le bon nom d'écran 'Order' et un objet contenant :
    // - storeName : une chaîne de caractères
    // - services : un tableau
    // - laundryId : une chaîne de caractères
    expect(mockNavigate).toHaveBeenCalledWith('Order', expect.objectContaining({
      storeName: expect.any(String),
      services: expect.any(Array),
      laundryId: expect.any(String),
    }));
  });
});
