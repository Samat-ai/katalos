import type { MediaEntry } from './types';

export const demoEntries: MediaEntry[] = [
  { id: 'spirited-away', title: 'Spirited Away', type: 'movie', status: 'finished', synopsis: 'A beloved fantasy about courage, wonder, and finding your way home.', rating: 5, note: 'Pure magic.', visibility: 'public' },
  { id: 'dune', title: 'Dune', type: 'book', status: 'in_progress', synopsis: 'A sweeping science-fiction epic on a desert planet.', rating: 4, note: 'Taking this slowly.', visibility: 'public' },
  { id: 'frieren', title: 'Frieren', type: 'manga', status: 'finished', synopsis: 'An elf mage reflects on the friendships that outlived an adventure.', rating: 5, visibility: 'public' },
  { id: 'bebop', title: 'Cowboy Bebop', type: 'anime', status: 'finished', synopsis: 'Bounty hunters drift through a stylish solar system.', rating: 5, visibility: 'public' },
  { id: 'perfect-blue', title: 'Perfect Blue', type: 'movie', status: 'planned', synopsis: 'A psychological thriller about fame and identity.', visibility: 'public' },
  { id: 'witch-hat', title: 'Witch Hat Atelier', type: 'manga', status: 'planned', synopsis: 'A girl discovers a world of intricate magic.', visibility: 'public' },
  { id: 'mob', title: 'Mob Psycho 100', type: 'anime', status: 'in_progress', synopsis: 'A gentle psychic tries to grow up with kindness.', rating: 4, visibility: 'public' },
  { id: 'earthsea', title: 'A Wizard of Earthsea', type: 'book', status: 'finished', synopsis: 'A young wizard learns the true cost of power.', rating: 5, visibility: 'public' },
  { id: 'evangelion', title: 'Neon Genesis Evangelion', type: 'anime', status: 'abandoned', synopsis: 'Teen pilots face impossible expectations.', visibility: 'private' },
  { id: 'house-leaves', title: 'House of Leaves', type: 'book', status: 'abandoned', synopsis: 'A labyrinthine story hiding inside a house.', visibility: 'public' },
  { id: 'porco', title: 'Porco Rosso', type: 'movie', status: 'finished', synopsis: 'A sky-bound adventure with a reluctant hero.', rating: 4, visibility: 'public' },
  { id: 'pluto', title: 'Pluto', type: 'manga', status: 'in_progress', synopsis: 'A detective investigates a series of robotic murders.', rating: 4, visibility: 'public' },
];
