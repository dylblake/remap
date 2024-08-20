"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
function up(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.createTable('services', (table) => {
            table.uuid('uuid').primary(); // UUID as primary key
            table.string('name').notNullable(); // Service name
            table.enu('tier', ['pending', 'approved', 'rejected']).notNullable(); // Enum for service tier
            table.uuid('upper_service_id').nullable(); // Optional UUID reference
            table.uuid('middle_service_id').nullable(); // Optional UUID reference
            table.timestamp('created_at').defaultTo(knex.fn.now()); // Creation timestamp
            table.timestamp('updated_at').defaultTo(knex.fn.now()); // Update timestamp
        });
    });
}
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.dropTable('services');
    });
}
