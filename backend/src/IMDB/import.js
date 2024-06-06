const neo4j = require('neo4j-driver');
const fs = require('fs');
const csv = require('csv-parser');
const cron = require('node-cron');
const pLimit = require('p-limit');

// Neo4j connection details
const uri = 'neo4j+s://d16778b5.databases.neo4j.io'; // Change this to your Neo4j URI
const user = 'neo4j'; // Change this to your username
const password = '1yDboUOlGobuDEJX6xw_JitPl-93pTFKN6iYJCyyvt0'; // Change this to your password

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
    maxConnectionPoolSize: 200 // Adjust this value based on your needs
  });
  
//   const deleteAllMovies = async () => {
//     const session = driver.session();
//     const query = 'MATCH (m:Movie) DETACH DELETE m';
    
//     try {
//       await session.run(query);
//       console.log('All movie nodes have been deleted.');
//     } catch (error) {
//       console.error('Error deleting movie nodes:', error);
//     } finally {
//       await session.close();
//     }
//   };
  
  const insertMovie = async (movie) => {
    const session = driver.session();
    const query = `
      MERGE (m:Movie {id: $id})
      SET m.title = $title,
          m.voteAverage = $voteAverage,
          m.voteCount = $voteCount,
          m.status = $status,
          m.releaseDate = $releaseDate,
          m.revenue = $revenue,
          m.runtime = $runtime,
          m.adult = $adult,
          m.backdropPath = $backdropPath,
          m.budget = $budget,
          m.homepage = $homepage,
          m.imdbId = $imdbId,
          m.originalLanguage = $originalLanguage,
          m.originalTitle = $originalTitle,
          m.overview = $overview,
          m.popularity = $popularity,
          m.posterPath = $posterPath,
          m.tagline = $tagline,
          m.genres = $genres,
          m.productionCompanies = $productionCompanies,
          m.productionCountries = $productionCountries,
          m.spokenLanguages = $spokenLanguages,
          m.keywords = $keywords
    `;
    
    try {
      await session.run(query, movie);
      console.log(`Inserted movie: ${movie.title}`);
    } catch (error) {
      console.error('Error inserting movie:', error);
    } finally {
      await session.close();
    }
  };
  
  const limit = pLimit(50); // Reduce the concurrency limit
  
  const fetchAndInsertMovies = async () => {
    return new Promise((resolve, reject) => {
      const insertPromises = [];
  
      fs.createReadStream('TMDB_movie_dataset_v11.csv')
        .pipe(csv())
        .on('data', (row) => {
          const movie = {
            id: parseInt(row.id),
            title: row.title,
            voteAverage: parseFloat(row.vote_average),
            voteCount: parseInt(row.vote_count),
            status: row.status,
            releaseDate: row.release_date,
            revenue: parseInt(row.revenue),
            runtime: parseInt(row.runtime),
            adult: row.adult === 'False',
            backdropPath: row.backdrop_path,
            budget: parseInt(row.budget),
            homepage: row.homepage,
            imdbId: row.imdb_id,
            originalLanguage: row.original_language,
            originalTitle: row.original_title,
            overview: row.overview,
            popularity: parseFloat(row.popularity),
            posterPath: row.poster_path,
            tagline: row.tagline,
            genres: row.genres.split(',').map(genre => genre.trim()),
            productionCompanies: row.production_companies.split(',').map(company => company.trim()),
            productionCountries: row.production_countries.split(',').map(country => country.trim()),
            spokenLanguages: row.spoken_languages.split(',').map(language => language.trim()),
            keywords: row.keywords.split(',').map(keyword => keyword.trim())
          };
  
          insertPromises.push(limit(() => insertMovie(movie)));
        })
        .on('end', async () => {
          try {
            await Promise.all(insertPromises);
            console.log('Data import complete');
            resolve();
          } catch (error) {
            console.error('Error inserting movies:', error);
            reject(error);
          }
        })
        .on('error', (error) => {
          console.error('Error reading CSV file:', error);
          reject(error);
        });
    });
  };
  
  const updateMovies = async () => {
    await deleteAllMovies();
    await fetchAndInsertMovies();
    console.log('Movies have been updated.');
  };
  
  // Schedule the update to run daily at midnight
  cron.schedule('0 0 * * *', () => {
    updateMovies().catch((error) => {
      console.error('Error updating movies:', error);
    });
  });
  
  // Run updateMovies immediately for the first time
  updateMovies().catch((error) => {
    console.error('Error during initial movie update:', error);
  });