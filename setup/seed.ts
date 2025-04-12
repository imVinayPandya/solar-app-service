import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';

import {
  ApplicationModel,
  ApplicationSchema,
} from '../src/infrastructure/models/application.model';
import { ApplicationPayload } from '../src/domain/entities/application.entity';

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/solar-applications');

  const Model = mongoose.model<ApplicationModel>(
    ApplicationModel.name,
    ApplicationSchema,
  );

  const count = await Model.countDocuments();
  if (count === 0) {
    const seedPath = path.join(__dirname, './seed.json');
    const seedData = JSON.parse(
      fs.readFileSync(seedPath, 'utf8'),
    ) as ApplicationPayload[];
    await Model.insertMany(seedData);
    console.log('Database seeded!');
  }

  await mongoose.disconnect();
}

seed().catch(console.error);
