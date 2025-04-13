import 'dotenv/config';
import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';

import {
  ApplicationsModel,
  ApplicationSchema,
} from '../src/applications/applications.model';
import { ApplicationPayload } from '../src/applications/domain/entities/application.entity';

async function seed() {
  const uri = process.env.DATABASE_URL!;
  if (!uri) {
    throw new Error('Please set DATABASE_URL env');
  }
  await mongoose.connect(uri);

  const Model = mongoose.model<ApplicationsModel>(
    ApplicationsModel.name,
    ApplicationSchema,
  );

  const seedPath = path.join(__dirname, './seed.json');
  const seedData = JSON.parse(
    fs.readFileSync(seedPath, 'utf8'),
  ) as ApplicationPayload[];
  await Model.insertMany(seedData);
  console.log('Database seeded!');

  await mongoose.disconnect();
}

seed()
  .catch(console.error)
  .finally(() => {
    process.exit(0);
  });
