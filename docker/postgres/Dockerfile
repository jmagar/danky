FROM ankane/pgvector:v0.5.1

# Create directory for init scripts
RUN mkdir -p /docker-entrypoint-initdb.d

# Copy initialization scripts
COPY init/*.sql /docker-entrypoint-initdb.d/

# Set proper permissions
RUN chmod 0755 /docker-entrypoint-initdb.d/* 