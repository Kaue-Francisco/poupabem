CREATE TABLE "users"(
    "id" UUID NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "senha" BIGINT NOT NULL,
    "criado_em" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "users" ADD PRIMARY KEY("id");
ALTER TABLE
    "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");
CREATE TABLE "categoria"(
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "tipo" VARCHAR(255) NOT NULL CHECK
        (
            "tipo" IN ('receita', 'despesa')
        ),
    "criado_em" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "categoria" ADD PRIMARY KEY("id");
CREATE TABLE "despesa"(
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "categoria_id" UUID NOT NULL,
    "valor" DECIMAL(8, 2) NOT NULL,
    "data" DATE NOT NULL,
    "descricao" TEXT NOT NULL,
    "criado_em" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "despesa" ADD PRIMARY KEY("id");
CREATE TABLE "receita"(
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "categoria_id" UUID NOT NULL,
    "valor" DECIMAL(8, 2) NOT NULL,
    "data" DATE NOT NULL,
    "descricao" TEXT NOT NULL,
    "criado_em" DATE NOT NULL
);
ALTER TABLE
    "receita" ADD PRIMARY KEY("id");
CREATE TABLE "orcamento"(
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "categoria_id" UUID NOT NULL,
    "limite" DECIMAL(8, 2) NOT NULL,
    "mes_ano" CHAR(7) NOT NULL,
    "criado_em" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "orcamento" ADD PRIMARY KEY("id");
ALTER TABLE
    "orcamento" ADD CONSTRAINT "orcamento_usuario_id_foreign" FOREIGN KEY("usuario_id") REFERENCES "users"("id");
ALTER TABLE
    "despesa" ADD CONSTRAINT "despesa_id_foreign" FOREIGN KEY("id") REFERENCES "categoria"("id");
ALTER TABLE
    "orcamento" ADD CONSTRAINT "orcamento_categoria_id_foreign" FOREIGN KEY("categoria_id") REFERENCES "categoria"("id");
ALTER TABLE
    "receita" ADD CONSTRAINT "receita_categoria_id_foreign" FOREIGN KEY("categoria_id") REFERENCES "categoria"("id");
ALTER TABLE
    "categoria" ADD CONSTRAINT "categoria_usuario_id_foreign" FOREIGN KEY("usuario_id") REFERENCES "users"("id");