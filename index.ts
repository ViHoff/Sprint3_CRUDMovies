const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());


app.get('/movies', async (req, res) => 
{
    const movies = await prisma.movie.findMany({ include: { reviews: true } });
    res.json(movies);
});

app.post('/movies', async (req, res) => 
{
    const { title, description, director, releaseYear, genre } = req.body;
    const movie = await prisma.movie.create(
        {
            data: { title, description, director, releaseYear, genre }
        });
        res.status(201).json(movie);
});

app.put('/movies/:id', async (req,res) =>
{
    const {id} = req.params;
    const data = req.body;
    const movie = await prisma.movie.update({ where: { id: Number(id) }, data });
    res.json(movie);
});

app.delete('/movies/:id', async (req,res) => 
{    
 try
{
    const id = Number(req.params.id); //tentei converter de string pra int na hora de colocar no id, nao na funçao do sql
    await prisma.movie.delete( {where: {id}});
    res.json({message:"deleted movie"});
} 
catch (error) 
{
    res.status(500).json({ error: 'Erro ao deletar filme', details: error.message });
}});

//moviesID

app.get('/reviews/:movieId', async (req,res) =>
{
    const {movieId} = req.params;
    const reviews = await prisma.review.findMany({where: { movieId: Number(movieId) } });
    res.json(reviews);
});

app.post('/reviews/:movieId', async (req, res) => 
{
    const { movieId } = req.params;
    const { user, rating, comment } = req.body;
    const review = await prisma.review.create( {data: { user, rating, comment, movieId: Number(movieId) }});
    res.status(201).json(review);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
































