const express = require('express');
const app = express()
const { Octokit } = require('@octokit/rest');

const cors = require('cors')
require('dotenv').config()

//middleware
app.use(express.json())
app.use(cors())



const port = process.env.PORT || 5000;

const octokit = new Octokit({
  auth:process.env.ACCESS_TOKEN,
});


console.log(process.env.ACCESS_TOKEN)

app.get('/', (req, res) => {
  res.send('life is beautiful');
});


// app.post('/repositories', async (req, res) => {
//   const { username, page, per_page } = req.body;
//   console.log(req.body)

//   try {
//     const response = await octokit.repos.listForUser({
//       username,
//       per_page: per_page || 10,
//       page: page || 1,
//     });

//     const repositories = response.data;
//     res.json({ repositories, totalPages: Math.ceil(response.headers.link.match(/page=(\d+)>; rel="last"/)[1]) });
//   } catch (error) {
//     console.error('Error fetching repositories:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

app.post('/repositories', async (req, res) => {
  const { username, page, per_page } = req.body;

  try {
    const response = await octokit.repos.listForUser({
      username,
      per_page: per_page || 10,
      page: page || 1,
    });

    const repositories = response.data;
    
    // Check if the "Link" header is present
    const linkHeader = response.headers.link;
    let totalPages = 1;

    if (linkHeader) {
      const match = linkHeader.match(/page=(\d+)>; rel="last"/);
      if (match) {
        totalPages = parseInt(match[1], 10);
      }
    }

    res.json({ repositories, totalPages });
  } catch (error) {
    console.error('Error fetching repositories:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/languages/:owner/:repo', async (req, res) => {
  const { owner, repo } = req.params;

  try {
    const response = await octokit.repos.listLanguages({
      owner,
      repo,
    });

    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching languages for ${owner}/${repo}:`, error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/user/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const response = await octokit.users.getByUsername({
      username,
    });

    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching user info for ${username}:`, error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running at Port:${port}`);
});
