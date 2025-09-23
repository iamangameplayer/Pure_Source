use actix_files as fs;
use actix_web::{get, post, web, App, HttpServer, Responder};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use std::env;

#[derive(Serialize)]
struct User {
    id: i32,
    name: String,
}

#[derive(Deserialize)]
struct NewUser {
    name: String,
}

#[get("/health")]
async fn health() -> impl Responder {
    actix_web::HttpResponse::Ok().json(serde_json::json!({"status": "ok"}))
}

#[get("/api/users")]
async fn get_users(pool: web::Data<PgPool>) -> impl Responder {
    let rows = sqlx::query!("SELECT id, name FROM users")
        .fetch_all(pool.get_ref())
        .await
        .unwrap();

    let users: Vec<User> = rows
        .into_iter()
        .map(|r| User {
            id: r.id,
            name: r.name.clone(),
        })
        .collect();

    actix_web::HttpResponse::Ok().json(users)
}

#[post("/api/users")]
async fn add_user(pool: web::Data<PgPool>, new_user: web::Json<NewUser>) -> impl Responder {
    let row = sqlx::query!(
        "INSERT INTO users (name) VALUES ($1) RETURNING id, name",
        new_user.name
    )
    .fetch_one(pool.get_ref())
    .await
    .unwrap();

    let user = User {
        id: row.id,
        name: row.name.clone(),
    };

    actix_web::HttpResponse::Ok().json(user)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let db_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = PgPool::connect(&db_url).await.expect("Failed to connect to DB");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .service(health)
            .service(get_users)
            .service(add_user)
            // serve your frontend (make sure ./frontend/public exists)
            .service(fs::Files::new("/", "./frontend/public").index_file("index.html"))
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
