/**
 * Demo data — 50 movies exactly as requested.
 * All posterUrl = TMDB CDN path → https://image.tmdb.org/t/p/w500{posterUrl}
 * No API key needed. High quality w500 images.
 */

export const DEMO_MOVIES = [

  // ── 1. Oppenheimer ────────────────────────────────────────────────
  { id: 872585,  title: 'Oppenheimer',
    language: 'English', genre: 'Drama',       durationMins: 180, releaseDate: '2023-07-21',
    posterUrl: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    description: 'The story of J. Robert Oppenheimer and his pivotal role in the Manhattan Project to develop the first atomic bomb.' },

  // ── 2. Animal ─────────────────────────────────────────────────────
  { id: 1014246, title: 'Animal',
    language: 'Hindi',   genre: 'Action',      durationMins: 201, releaseDate: '2023-12-01',
    posterUrl: '/jafJMR9m7gnBBfRrRf0YXF7GIIY.jpg',
    description: 'A man returns to India after years abroad and becomes his father\'s ruthless protector, descending into violence.' },

  // ── 3. Leo ────────────────────────────────────────────────────────
  { id: 927489,  title: 'Leo',
    language: 'Tamil',   genre: 'Action',      durationMins: 164, releaseDate: '2023-10-19',
    posterUrl: '/bClpMFRRYGIoUrADXiHOZgZAqiQ.jpg',
    description: 'A mild-mannered cafe owner is forced to confront his mysterious and dangerous past.' },

  // ── 4. Salaar: Part 1 – Ceasefire ────────────────────────────────
  { id: 1156593, title: 'Salaar: Ceasefire',
    language: 'Hindi',   genre: 'Action',      durationMins: 175, releaseDate: '2023-12-22',
    posterUrl: '/3mDaBHqnHvFJuCzRlNPnSfLJqtl.jpg',
    description: 'A fierce warrior\'s promise to his dying friend forces him to return to a kingdom and protect his friend\'s son.' },

  // ── 5. Dune: Part Two ─────────────────────────────────────────────
  { id: 438631,  title: 'Dune: Part Two',
    language: 'English', genre: 'Sci-Fi',      durationMins: 166, releaseDate: '2024-03-01',
    posterUrl: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.' },

  // ── 6. Kill ───────────────────────────────────────────────────────
  { id: 1251094, title: 'Kill',
    language: 'Hindi',   genre: 'Action',      durationMins: 105, releaseDate: '2024-07-05',
    posterUrl: '/mICSnF38uRo0GCFz1bfMEkOZKCG.jpg',
    description: 'An army commando must protect a group of passengers on a train hijacked by 40 ruthless criminals.' },

  // ── 7. Fighter ────────────────────────────────────────────────────
  { id: 1075794, title: 'Fighter',
    language: 'Hindi',   genre: 'Action',      durationMins: 166, releaseDate: '2024-01-25',
    posterUrl: '/bBuFoIFBBa1QkDSmZdEHjyIHMIF.jpg',
    description: 'India\'s first aerial action franchise following the brave pilots of the Indian Air Force.' },

  // ── 8. Jawan ──────────────────────────────────────────────────────
  { id: 979275,  title: 'Jawan',
    language: 'Hindi',   genre: 'Action',      durationMins: 169, releaseDate: '2023-09-07',
    posterUrl: '/oqGqsOQgqAiqWFTSYHlGNpD1w9s.jpg',
    description: 'A high-octane action thriller about a man driven to rectify the wrongs in society, leading to a showdown between him and a ruthless industrialist.' },

  // ── 9. Pathaan ────────────────────────────────────────────────────
  { id: 918289,  title: 'Pathaan',
    language: 'Hindi',   genre: 'Action',      durationMins: 146, releaseDate: '2023-01-25',
    posterUrl: '/hMhOJ9cOJMDdEPyD0K6JuCH0gTx.jpg',
    description: 'An Indian spy takes on the leader of a rogue mercenary organisation that poses a grave threat to national security.' },

  // ── 10. Vikram Vedha ──────────────────────────────────────────────
  { id: 853609,  title: 'Vikram Vedha',
    language: 'Hindi',   genre: 'Thriller',    durationMins: 150, releaseDate: '2022-09-30',
    posterUrl: '/pzDFmHkxMz4eiVVkhj2n4VEL0ek.jpg',
    description: 'A tough cop tries to nab an equally tough gangster, but is taken aback when the gangster surrenders and begins telling him stories.' },

  // ── 11. The Batman ────────────────────────────────────────────────
  { id: 414906,  title: 'The Batman',
    language: 'English', genre: 'Action',      durationMins: 176, releaseDate: '2022-03-04',
    posterUrl: '/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    description: 'Batman ventures into Gotham City\'s underworld when a sadistic killer leaves behind a trail of cryptic clues.' },

  // ── 12. Everything Everywhere All at Once ─────────────────────────
  { id: 545611,  title: 'Everything Everywhere All at Once',
    language: 'English', genre: 'Sci-Fi',      durationMins: 139, releaseDate: '2022-03-25',
    posterUrl: '/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg',
    description: 'A middle-aged Chinese immigrant is swept up in an insane adventure where she alone can save the multiverse by exploring other universes.' },

  // ── 13. Top Gun: Maverick ─────────────────────────────────────────
  { id: 361743,  title: 'Top Gun: Maverick',
    language: 'English', genre: 'Action',      durationMins: 130, releaseDate: '2022-05-27',
    posterUrl: '/62HCnUTHOIF3iKBHxuYIdnSqkAz.jpg',
    description: 'After 30 years, Pete "Maverick" Mitchell is still pushing the envelope as a top naval aviator, training a new generation of Top Gun graduates.' },

  // ── 14. Nope ──────────────────────────────────────────────────────
  { id: 762504,  title: 'Nope',
    language: 'English', genre: 'Horror',      durationMins: 130, releaseDate: '2022-07-22',
    posterUrl: '/AcKVlWaNVVVFQwro3nLXqPljcYA.jpg',
    description: 'A UFO sighting turns horrifying for the inhabitants of a secluded California gulch, including two siblings who witness something inhuman.' },

  // ── 15. Barbarian ─────────────────────────────────────────────────
  { id: 760098,  title: 'Barbarian',
    language: 'English', genre: 'Horror',      durationMins: 102, releaseDate: '2022-09-09',
    posterUrl: '/d0KFO0pW8AJ0LUzBxfF0uPt6YG5.jpg',
    description: 'A woman discovers her Airbnb rental is already occupied by a stranger and must navigate a terrifying secret beneath the house.' },

  // ── 16. The Menu ──────────────────────────────────────────────────
  { id: 766507,  title: 'The Menu',
    language: 'English', genre: 'Thriller',    durationMins: 107, releaseDate: '2022-11-18',
    posterUrl: '/jZSNJhQzqBCRCQCxm4Bwzrjzx6h.jpg',
    description: 'A young couple travels to a remote island to eat at an exclusive restaurant where the chef has prepared a unique menu with shocking surprises.' },

  // ── 17. Smile ─────────────────────────────────────────────────────
  { id: 838209,  title: 'Smile',
    language: 'English', genre: 'Horror',      durationMins: 115, releaseDate: '2022-09-30',
    posterUrl: '/aPqcQwu4VGEewPhagqNNjiKVHj8.jpg',
    description: 'After witnessing a bizarre, traumatic incident involving a patient, a doctor begins experiencing frightening occurrences.' },

  // ── 18. Talk to Me ────────────────────────────────────────────────
  { id: 967847,  title: 'Talk to Me',
    language: 'English', genre: 'Horror',      durationMins: 95,  releaseDate: '2023-07-28',
    posterUrl: '/kdPMnXO7elAh9mNqQ8PdMoXJSWz.jpg',
    description: 'A group of friends discover a way to conjure spirits using an embalmed hand — but what begins as fun quickly turns sinister.' },

  // ── 19. The Nun II ────────────────────────────────────────────────
  { id: 507086,  title: 'The Nun II',
    language: 'English', genre: 'Horror',      durationMins: 110, releaseDate: '2023-09-08',
    posterUrl: '/5gzzkR7y3hnY8AD1wXjCnVlHba5.jpg',
    description: 'In 1956 France, a priest is murdered. A nun and a novitiate are sent by the Vatican to investigate, confronting the demonic force Valak.' },

  // ── 20. Evil Dead Rise ────────────────────────────────────────────
  { id: 713704,  title: 'Evil Dead Rise',
    language: 'English', genre: 'Horror',      durationMins: 97,  releaseDate: '2023-04-21',
    posterUrl: '/5ik1gXSCKOGMRl71mfvt1fhG0dA.jpg',
    description: 'A reunion between two estranged sisters is cut short by the rise of flesh-possessing demons in a Los Angeles apartment building.' },

  // ── 21. Suzume ────────────────────────────────────────────────────
  { id: 1056360, title: 'Suzume',
    language: 'Japanese', genre: 'Animation',  durationMins: 122, releaseDate: '2023-04-14',
    posterUrl: '/lN2STXouEJgDOIE7DpnYhFKiBAO.jpg',
    description: 'A teenage girl helps a mysterious young man close a supernatural door before it can unleash disasters across Japan.' },

  // ── 22. The Super Mario Bros. Movie ──────────────────────────────
  { id: 502356,  title: 'The Super Mario Bros. Movie',
    language: 'English', genre: 'Animation',   durationMins: 92,  releaseDate: '2023-04-05',
    posterUrl: '/qNBAXBIQlnOThrVvA6mA2B5ggkM.jpg',
    description: 'A plumber named Mario travels through an underground maze with his brother Luigi, trying to save a captured princess.' },

  // ── 23. Spider-Man: Across the Spider-Verse ───────────────────────
  { id: 569094,  title: 'Spider-Man: Across the Spider-Verse',
    language: 'English', genre: 'Animation',   durationMins: 140, releaseDate: '2023-06-02',
    posterUrl: '/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.' },

  // ── 24. Elemental ─────────────────────────────────────────────────
  { id: 976573,  title: 'Elemental',
    language: 'English', genre: 'Animation',   durationMins: 101, releaseDate: '2023-06-16',
    posterUrl: '/6oH378KUfgKRMLNcJHQEQS7XFNM.jpg',
    description: 'In a city where fire, water, land and air residents live together, a fiery young woman and a go-with-the-flow guy discover something elemental.' },

  // ── 25. Wish ──────────────────────────────────────────────────────
  { id: 1022789, title: 'Wish',
    language: 'English', genre: 'Animation',   durationMins: 95,  releaseDate: '2023-11-22',
    posterUrl: '/ACoZMCKUVj1jKMIllBhXPJHjMJY.jpg',
    description: 'A young girl named Asha wishes on a star and gets a more direct answer than she expected when a cosmic force — a little ball of boundless energy — comes to her aid.' },

  // ── 26. Drishyam 2 ────────────────────────────────────────────────
  { id: 882598,  title: 'Drishyam 2',
    language: 'Hindi',   genre: 'Thriller',    durationMins: 152, releaseDate: '2022-11-18',
    posterUrl: '/BHW7sqHpF0QVFdPq9EXbKFIpZjj.jpg',
    description: 'Vijay Salgaonkar must once again protect his family from the law as new evidence threatens to uncover the truth from seven years ago.' },

  // ── 27. 12th Fail ────────────────────────────────────────────────
  { id: 1234261, title: '12th Fail',
    language: 'Hindi',   genre: 'Drama',       durationMins: 147, releaseDate: '2023-10-27',
    posterUrl: '/tlQKPWNpnIJtNLgNOmTI9jHRMi0.jpg',
    description: 'The inspiring real life story of IPS Officer Manoj Kumar Sharma who failed his 12th exams but never gave up on his dream.' },

  // ── 28. Kantara ───────────────────────────────────────────────────
  { id: 1077280, title: 'Kantara',
    language: 'Kannada', genre: 'Action',      durationMins: 148, releaseDate: '2022-09-30',
    posterUrl: '/bljXxJBjaNwbXbfDqABiGrXAw6H.jpg',
    description: 'A conflict between humans and nature about land and its ownership culminates in a divine battle between a forest official and a local hero.' },

  // ── 29. Dasara ────────────────────────────────────────────────────
  { id: 1058688, title: 'Dasara',
    language: 'Telugu',  genre: 'Drama',       durationMins: 175, releaseDate: '2023-03-30',
    posterUrl: '/dBXLkJjKxNMpELrjhVGJCxlHaqS.jpg',
    description: 'In the coal mines of Singareni, a carefree coal miner is forced to confront his past when circumstances take a dark turn.' },

  // ── 30. Maaveeran ────────────────────────────────────────────────
  { id: 1173583, title: 'Maaveeran',
    language: 'Tamil',   genre: 'Action',      durationMins: 160, releaseDate: '2023-07-14',
    posterUrl: '/clZl8WsXHvV3ZZr0rVKdVknjFoP.jpg',
    description: 'A timid cartoonist begins hearing the voice of a superhero he created and gains confidence to fight against corrupt officials.' },

  // ── 31. The Roundup: No Way Out ───────────────────────────────────
  { id: 940551,  title: 'The Roundup: No Way Out',
    language: 'Korean',  genre: 'Action',      durationMins: 105, releaseDate: '2023-05-31',
    posterUrl: '/9cnyJBUC2HNYRNcgpTCEhXukiSX.jpg',
    description: 'Detective Ma Seok-do takes on a drug ring operation linked to a violent murder case.' },

  // ── 32. Decision to Leave ─────────────────────────────────────────
  { id: 838982,  title: 'Decision to Leave',
    language: 'Korean',  genre: 'Thriller',    durationMins: 138, releaseDate: '2022-10-14',
    posterUrl: '/zgNxZOiuwqvnuCJmTOGwFNAbzNE.jpg',
    description: 'A detective investigating a man\'s death in the mountains meets the dead man\'s mysterious wife, and begins to suspect her.' },

  // ── 33. Concrete Utopia ───────────────────────────────────────────
  { id: 1074724, title: 'Concrete Utopia',
    language: 'Korean',  genre: 'Drama',       durationMins: 130, releaseDate: '2023-08-09',
    posterUrl: '/7K2riGJMkbMH3jkVi2Cko7fjPDJ.jpg',
    description: 'After a massive earthquake destroys Seoul, the only survivors in a ruined apartment complex must band together to survive.' },

  // ── 34. Exhuma ────────────────────────────────────────────────────
  { id: 1209290, title: 'Exhuma',
    language: 'Korean',  genre: 'Horror',      durationMins: 134, releaseDate: '2024-02-22',
    posterUrl: '/4HodP5CZ4rOhqBMmrIqmSAp7pCG.jpg',
    description: 'Shamans are hired to relocate the grave of a wealthy family patriarch, but the exhumation leads to terrifying supernatural events.' },

  // ── 35. The Call ──────────────────────────────────────────────────
  { id: 632622,  title: 'The Call',
    language: 'Korean',  genre: 'Thriller',    durationMins: 112, releaseDate: '2020-11-27',
    posterUrl: '/ahxuRYb9KYBi8hcJULgkKC5fwG1.jpg',
    description: 'Two women living 20 years apart connect through a phone call and soon discover their actions can directly affect the other\'s timeline.' },

  // ── 36. The Killer ────────────────────────────────────────────────
  { id: 678512,  title: 'The Killer',
    language: 'English', genre: 'Thriller',    durationMins: 118, releaseDate: '2023-10-27',
    posterUrl: '/e3G9MFZxLMQmMBKSBHrZuuZmSEf.jpg',
    description: 'A hitman with a cold, calculating mind goes on a relentless pursuit after a fateful encounter threatens his way of life.' },

  // ── 37. Extraction 2 ──────────────────────────────────────────────
  { id: 616037,  title: 'Extraction 2',
    language: 'English', genre: 'Action',      durationMins: 122, releaseDate: '2023-06-16',
    posterUrl: '/mHwjGHFbKvGVBOLfHUVtAhMBUua.jpg',
    description: 'Tyler Rake returns from the brink of death with a new mission: to rescue the imprisoned family of a ruthless Georgian gangster.' },

  // ── 38. Rebel Moon – Part One ─────────────────────────────────────
  { id: 848538,  title: 'Rebel Moon – Part One',
    language: 'English', genre: 'Sci-Fi',      durationMins: 134, releaseDate: '2023-12-22',
    posterUrl: '/ui4DrH1cKk2vkHshpOJOWWXNXrf.jpg',
    description: 'A peaceful colony on the edge of the galaxy is threatened by the armies of a tyrannical regent named Balisarius.' },

  // ── 39. Civil War ─────────────────────────────────────────────────
  { id: 1056646, title: 'Civil War',
    language: 'English', genre: 'Thriller',    durationMins: 109, releaseDate: '2024-04-12',
    posterUrl: '/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg',
    description: 'A team of journalists travel across a war-ravaged America during a second civil war, documenting the conflict as they go.' },

  // ── 40. Kingdom of the Planet of the Apes ────────────────────────
  { id: 653346,  title: 'Kingdom of the Planet of the Apes',
    language: 'English', genre: 'Sci-Fi',      durationMins: 145, releaseDate: '2024-05-10',
    posterUrl: '/gKkl37BQuKTanygYQG1pyYgLVgf.jpg',
    description: 'Many years after the reign of Caesar, a young ape goes on a journey that leads him to question everything he\'s been taught.' },

  // ── 41. Deadpool & Wolverine ──────────────────────────────────────
  { id: 533535,  title: 'Deadpool & Wolverine',
    language: 'English', genre: 'Action',      durationMins: 128, releaseDate: '2024-07-26',
    posterUrl: '/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    description: 'A listless Wade Wilson toils away in civilian life until he\'s brought back to pull off an impossible mission with Wolverine.' },

  // ── 42. Godzilla x Kong: The New Empire ──────────────────────────
  { id: 823464,  title: 'Godzilla x Kong: The New Empire',
    language: 'English', genre: 'Action',      durationMins: 115, releaseDate: '2024-03-29',
    posterUrl: '/nIVkDEDPJu2dLZMQ5GHAmSQ8K3P.jpg',
    description: 'Two ancient titans, Godzilla and Kong, clash in an epic battle as humans unravel their intertwined origins and the mystery of Skull Island.' },

  // ── 43. Bhool Bhulaiyaa 2 ─────────────────────────────────────────
  { id: 809462,  title: 'Bhool Bhulaiyaa 2',
    language: 'Hindi',   genre: 'Comedy',      durationMins: 143, releaseDate: '2022-05-20',
    posterUrl: '/zJTbJPRlSKdDSmFMD8HaFxf58M3.jpg',
    description: 'A young man accidentally summons the spirit of Manjulika when he visits a haunted haveli with his girlfriend\'s family.' },

  // ── 44. Stree 2 ───────────────────────────────────────────────────
  { id: 1300344, title: 'Stree 2',
    language: 'Hindi',   genre: 'Comedy',      durationMins: 157, releaseDate: '2024-08-15',
    posterUrl: '/99mCOBfMNE0TzbuS8EBQmFrTBln.jpg',
    description: 'The men of Chanderi face a new supernatural threat as a headless ghost targets women, forcing them to seek the mysterious Stree\'s help.' },

  // ── 45. Aavesham ──────────────────────────────────────────────────
  { id: 1362570, title: 'Aavesham',
    language: 'Malayalam', genre: 'Comedy',    durationMins: 163, releaseDate: '2024-04-11',
    posterUrl: '/3IHNheHPAEMkuZDHWOVG7lPe4LH.jpg',
    description: 'Three engineering students hire a notorious gangster as their bodyguard against college bullies, with unexpectedly hilarious consequences.' },

  // ── 46. Kalki 2898 AD ─────────────────────────────────────────────
  { id: 1297585, title: 'Kalki 2898 AD',
    language: 'Telugu',  genre: 'Sci-Fi',      durationMins: 181, releaseDate: '2024-06-27',
    posterUrl: '/2y8HRgAbvpdAFO6W0cekV4ZcHJy.jpg',
    description: 'Set in 2898 AD, a dystopian future blending Hindu mythology and sci-fi, where the 10th avatar of Vishnu is destined to appear.' },

  // ── 47. Pushpa 2: The Rule ────────────────────────────────────────
  { id: 1087822, title: 'Pushpa 2: The Rule',
    language: 'Hindi',   genre: 'Action',      durationMins: 210, releaseDate: '2024-12-05',
    posterUrl: '/pDIHkjHwGEGU6mVUJvdHOivvFRs.jpg',
    description: 'Pushpa Raj expands his red sandalwood smuggling empire while coming face to face with his arch-nemesis Bhanwar Singh Shekawat.' },

  // ── 48. The Substance ─────────────────────────────────────────────
  { id: 933260,  title: 'The Substance',
    language: 'English', genre: 'Horror',      durationMins: 140, releaseDate: '2024-09-20',
    posterUrl: '/lqoMzCcZYEFK729d6qzt349fB4o.jpg',
    description: 'A fading celebrity takes a black-market drug called The Substance that creates a younger, better, perfect version of herself.' },

  // ── 49. Longlegs ──────────────────────────────────────────────────
  { id: 1064028, title: 'Longlegs',
    language: 'English', genre: 'Thriller',    durationMins: 101, releaseDate: '2024-07-12',
    posterUrl: '/kvbBSYRSrSEFXFlKiOvK3Ct2yyg.jpg',
    description: 'An FBI agent is drawn into a serial killer investigation involving coded messages and a mysterious figure called Longlegs.' },

  // ── 50. The Fall Guy ──────────────────────────────────────────────
  { id: 746036,  title: 'The Fall Guy',
    language: 'English', genre: 'Action',      durationMins: 126, releaseDate: '2024-05-03',
    posterUrl: '/tSz1qsmSJon0rqjHBxXZmrotuse.jpg',
    description: 'A stuntman is drawn back to the industry and into a mystery surrounding a major film production.' },
];

// ── Hero carousel backdrops ──────────────────────────────────────────────────
export const DEMO_BACKDROPS = [
  { id: 872585,  title: 'Oppenheimer',           backdrop_path: '/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg', description: 'The story of J. Robert Oppenheimer and the development of the first nuclear weapon.' },
  { id: 533535,  title: 'Deadpool & Wolverine',  backdrop_path: '/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg', description: 'Wade Wilson is brought back for an impossible mission alongside Wolverine.' },
  { id: 438631,  title: 'Dune: Part Two',        backdrop_path: '/xOMo8BRK7PfcJv9JCnx7s5hj0NX.jpg', description: 'Paul Atreides unites with the Fremen while seeking revenge against his enemies.' },
  { id: 1014246, title: 'Animal',                backdrop_path: '/1LRLLWGvs5sZdTzuMWGOCMxm7k9.jpg', description: 'A man returns to India and becomes his father\'s ruthless and unstoppable protector.' },
  { id: 1297585, title: 'Kalki 2898 AD',         backdrop_path: '/5a4JdoFwll5DRtKMe7JLuGQ9yJm.jpg', description: 'In a dystopian future blending Hindu mythology and sci-fi, the 10th avatar rises.' },
];