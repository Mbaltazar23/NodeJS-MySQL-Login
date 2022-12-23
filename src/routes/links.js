const express = require("express");

const router = express.Router();

const pool = require("../database");

const { isLoggedIn } = require("../lib/auth");

router.get("/add", (req, res) => {
  res.render("links/add");
});

router.post("/add", isLoggedIn, async (req, res) => {
  const { title, url, description } = req.body;
  const newLink = {
    title,
    url,
    description,
    user_id: req.user.id,
  };
  await pool.query("INSERT INTO links set ?", [newLink]);
  req.flash("success", "Link saved successfully !!");
  res.redirect("/links");
});

router.get("/", isLoggedIn, async (req, res) => {
  const links = await pool.query("SELECT * FROM links WHERE user_id = ?", [
    req.user.id,
  ]);
  //console.log(links);
  res.render("links/list", { links });
});

router.get("/edit/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const link = await pool.query("SELECT * FROM links WHERE id =?", [id]);
  res.render("links/edit", { link: link[0] });
});

router.get("/delete/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM links WHERE id =?", [id]);
  req.flash("success", "Link removed successfully !!");
  res.redirect("/links");
});

router.post("/edit/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { title, url, description } = req.body;
  await pool.query(
    "UPDATE links SET title =?, url =?, description =? WHERE id =?",
    [title, url, description, id]
  );
  req.flash("success", "Link updated successfully !!");
  res.redirect("/links");
});

module.exports = router;
