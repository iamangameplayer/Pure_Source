FROM rust:1.83 as builder
WORKDIR /app

# Copy everything first to ensure Cargo sees the target
COPY Cargo.toml Cargo.lock ./ 
COPY src ./src

RUN cargo build --release

FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /app/target/release/backend /app/backend

EXPOSE 8080
CMD ["./backend"]
