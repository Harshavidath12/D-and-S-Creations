const mongoose = require('mongoose');
const Cinema = require('./models/Cinema');

const seedCinemas = async () => {
  try {
    await mongoose.connect('mongodb+srv://vihigum:H4UiHdZM640pbRnI@cluster0.sp3lpkf.mongodb.net/test?retryWrites=true&w=majority&tls=true');
    console.log('Connected to MongoDB');

    // Check if cinemas already exist
    const existingCinemas = await Cinema.countDocuments();
    console.log('Existing cinemas:', existingCinemas);

    if (existingCinemas === 0) {
      // Create sample cinemas
      const sampleCinemas = [
        {
          cinema_name: 'Cineplex Downtown',
          cinema_location: '123 Main Street, Downtown',
          ongoing_movies: {
            movie_1: { 
              name: 'The Dark Knight', 
              start_date: new Date('2024-01-01'), 
              end_date: new Date('2024-12-31'), 
              trailer_link: 'https://youtube.com/watch?v=EXeTwQWrcwY' 
            },
            movie_2: { 
              name: 'Inception', 
              start_date: new Date('2024-01-01'), 
              end_date: new Date('2024-12-31'), 
              trailer_link: 'https://youtube.com/watch?v=YoHD9XEInc0' 
            },
            movie_3: { 
              name: 'Interstellar', 
              start_date: new Date('2024-01-01'), 
              end_date: new Date('2024-12-31'), 
              trailer_link: 'https://youtube.com/watch?v=zSWdZVtXT7E' 
            },
            movie_4: { 
              name: 'The Matrix', 
              start_date: new Date('2024-01-01'), 
              end_date: new Date('2024-12-31'), 
              trailer_link: 'https://youtube.com/watch?v=m8e-FF8MsqU' 
            }
          },
          upcoming_movies: {
            movie_1: { name: 'Dune 2', trailer_link: 'https://youtube.com/watch?v=Way9Dexny3w' },
            movie_2: { name: 'Avatar 3', trailer_link: 'https://youtube.com/watch?v=5PSNL1qE6VY' }
          },
          contact_info: {
            phone: '+1 (555) 123-4567',
            email: 'downtown@cineplex.com'
          },
          movie_slot_pricing: {
            movie_1: { starting_price: 100, interval_price: 150, ending_price: 120 },
            movie_2: { starting_price: 120, interval_price: 180, ending_price: 140 },
            movie_3: { starting_price: 110, interval_price: 160, ending_price: 130 },
            movie_4: { starting_price: 90, interval_price: 140, ending_price: 110 }
          },
          is_active: true
        },
        {
          cinema_name: 'Mega Cinema',
          cinema_location: '456 Oak Avenue, Midtown',
          ongoing_movies: {
            movie_1: { 
              name: 'Spider-Man: No Way Home', 
              start_date: new Date('2024-01-01'), 
              end_date: new Date('2024-12-31'), 
              trailer_link: 'https://youtube.com/watch?v=JfVOs4VSpmA' 
            },
            movie_2: { 
              name: 'Top Gun: Maverick', 
              start_date: new Date('2024-01-01'), 
              end_date: new Date('2024-12-31'), 
              trailer_link: 'https://youtube.com/watch?v=qSqVVswa4vE' 
            },
            movie_3: { 
              name: 'Black Widow', 
              start_date: new Date('2024-01-01'), 
              end_date: new Date('2024-12-31'), 
              trailer_link: 'https://youtube.com/watch?v=ybji16u608U' 
            },
            movie_4: { 
              name: 'Fast & Furious 9', 
              start_date: new Date('2024-01-01'), 
              end_date: new Date('2024-12-31'), 
              trailer_link: 'https://youtube.com/watch?v=aSiDu3Ywi8E' 
            }
          },
          upcoming_movies: {
            movie_1: { name: 'Mission Impossible 8', trailer_link: 'https://youtube.com/watch?v=avz06PDqDbM' },
            movie_2: { name: 'Indiana Jones 5', trailer_link: 'https://youtube.com/watch?v=eQfMbSe7F2g' }
          },
          contact_info: {
            phone: '+1 (555) 987-6543',
            email: 'midtown@megacinema.com'
          },
          movie_slot_pricing: {
            movie_1: { starting_price: 130, interval_price: 200, ending_price: 150 },
            movie_2: { starting_price: 140, interval_price: 220, ending_price: 160 },
            movie_3: { starting_price: 125, interval_price: 190, ending_price: 145 },
            movie_4: { starting_price: 115, interval_price: 175, ending_price: 135 }
          },
          is_active: true
        },
        {
          cinema_name: 'Royal Theater',
          cinema_location: '789 Park Boulevard, Uptown',
          ongoing_movies: {
            movie_1: { 
              name: 'Avengers: Endgame', 
              start_date: new Date('2024-01-01'), 
              end_date: new Date('2024-12-31'), 
              trailer_link: 'https://youtube.com/watch?v=TcMBFSGVi1c' 
            },
            movie_2: { 
              name: 'Titanic', 
              start_date: new Date('2024-01-01'), 
              end_date: new Date('2024-12-31'), 
              trailer_link: 'https://youtube.com/watch?v=CHekzSiSjrA' 
            },
            movie_3: { 
              name: 'Jurassic World', 
              start_date: new Date('2024-01-01'), 
              end_date: new Date('2024-12-31'), 
              trailer_link: 'https://youtube.com/watch?v=RFinNxS-xQU' 
            },
            movie_4: { 
              name: 'Wonder Woman', 
              start_date: new Date('2024-01-01'), 
              end_date: new Date('2024-12-31'), 
              trailer_link: 'https://youtube.com/watch?v=1Q8fG0TtVAY' 
            }
          },
          upcoming_movies: {
            movie_1: { name: 'Black Panther 2', trailer_link: 'https://youtube.com/watch?v=RlOB3UALvrQ' },
            movie_2: { name: 'Thor: Love and Thunder', trailer_link: 'https://youtube.com/watch?v=Go8nTmfrQd8' }
          },
          contact_info: {
            phone: '+1 (555) 456-7890',
            email: 'uptown@royaltheater.com'
          },
          movie_slot_pricing: {
            movie_1: { starting_price: 150, interval_price: 250, ending_price: 180 },
            movie_2: { starting_price: 160, interval_price: 270, ending_price: 190 },
            movie_3: { starting_price: 145, interval_price: 240, ending_price: 175 },
            movie_4: { starting_price: 135, interval_price: 220, ending_price: 165 }
          },
          is_active: true
        }
      ];

      await Cinema.insertMany(sampleCinemas);
      console.log('Sample cinemas created successfully!');
    } else {
      console.log('Cinemas already exist, skipping creation');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedCinemas();
