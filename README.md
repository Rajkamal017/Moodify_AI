# Moodify_AI

so basically this app looks at your mood and gives you music. that's it. that's the whole thing.

i built this because i was tired of scrolling through spotify for 20 minutes and ending up on the same playlist i always use. the AI does the picking now. sometimes it's right. sometimes it's not. we don't talk about those times.

---

## what it does

you tell it how you feel (or it figures it out on its own, depends on the version you're running), and it spits out music recommendations that match your vibe. happy, sad, angry, that weird melancholy you get on sunday evenings — it handles all of it.

frontend is in React with SCSS because i like my styles organized even when my life isn't. backend handles all the AI stuff.

---

## running it locally

you'll need node installed. if you don't have node installed i don't know what to tell you.

```bash
git clone https://github.com/Rajkamal017/Moodify_AI.git
cd Moodify_AI
```

then open two terminals like a normal person:

**terminal 1 (backend):**
```bash
cd Backend
npm install
npm start
```

**terminal 2 (frontend):**
```bash
cd Frontend
npm install
npm start
```

should be running on localhost:3000 or whatever port it decides to use that day.

---

## project structure

```
Moodify_AI/
├── Backend/    # the AI lives here
└── Frontend/   # the pretty part
```

nothing crazy. Backend does the thinking, Frontend shows the results.

---

## tech

- JavaScript
- SCSS
- HTML (a little bit)

---

## contributing

fork it, fix something, open a PR. if you find a bug where it gives you death metal when you're happy, that's a known issue and also kind of funny so maybe leave it.

---

## todo (maybe, no promises)

- [ ] make the mood detection more accurate
- [ ] add more music sources
- [ ] fix the thing that breaks sometimes (you'll know it when you see it)

---

made this as a project, still tweaking things. if something doesn't work just open an issue and i'll get to it eventually
