-- CreateEnum
CREATE TYPE "public"."VehicleType" AS ENUM ('Bike', 'Activa');

-- AlterTable
ALTER TABLE "public"."vehicles" ADD COLUMN     "type" "public"."VehicleType" NOT NULL DEFAULT 'Bike';
