const mongoose = require('mongoose');
const Cinema = require('./models/Cinema');

const updateMovieDates = async () => {
  try {
    await mongoose.connect('mongodb+srv://vihigum:H4UiHdZM640pbRnI@cluster0.sp3lpkf.mongodb.net/test?retryWrites=true&w=majority&tls=true');
    console.log('Connected to MongoDB');

    // Update all cinemas to have current movie dates
    const today = new Date();
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 6); // 6 months from now

    const result = await Cinema.updateMany(
      {},
      {
        $set: {
          'ongoing_movies.movie_1.start_date': today,
          'ongoing_movies.movie_1.end_date': futureDate,
          'ongoing_movies.movie_2.start_date': today,
          'ongoing_movies.movie_2.end_date': futureDate,
          'ongoing_movies.movie_3.start_date': today,
          'ongoing_movies.movie_3.end_date': futureDate,
          'ongoing_movies.movie_4.start_date': today,
          'ongoing_movies.movie_4.end_date': futureDate
        }
      }
    );

    console.log('Updated', result.modifiedCount, 'cinemas with current dates');

    // Test the API response
    const cinemas = await Cinema.find({ is_active: true });
    console.log('Active cinemas found:', cinemas.length);
    
    if (cinemas.length > 0) {
      console.log('First cinema name:', cinemas[0].cinema_name);
      console.log('First cinema movies:');
      Object.keys(cinemas[0].ongoing_movies).forEach(key => {
        const movie = cinemas[0].ongoing_movies[key];
        if (movie && movie.name) {
          console.log(`  ${key}: ${movie.name} (${movie.start_date} to ${movie.end_date})`);
        }
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('Error updating dates:', error);
    process.exit(1);
  }
};

updateMovieDates();
