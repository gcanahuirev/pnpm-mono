-- CreateTable
CREATE TABLE "space" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "module" VARCHAR(128),
    "status" BOOLEAN NOT NULL DEFAULT true,
    "parent" INTEGER,
    "path" VARCHAR(255) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "space_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(255) NOT NULL,
    "size" INTEGER NOT NULL,
    "path" VARCHAR(255) NOT NULL,
    "tag" INTEGER,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "space_id" INTEGER NOT NULL,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
