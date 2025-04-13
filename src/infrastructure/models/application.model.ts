import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, now, Types } from 'mongoose';
import {
  ApplicationStatus,
  EnumApplicationStatus,
} from '../../domain/entities/application.entity';
// import { v4 as uuidv4 } from 'uuid';

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret) => {
      ret.id = (ret._id as Types.ObjectId).toHexString(); // Convert _id to id
      delete ret._id; // Remove _id
      delete ret.__v; // Remove version key
      return ret;
    },
  },
})
export class ApplicationModel extends Document {
  @Prop({
    type: String,
    required: [true, 'ID is required'],
    unique: true,
    default: function () {
      return ((this as ApplicationModel)._id as Types.ObjectId).toHexString();
    },
  })
  declare id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: false,
    enum: EnumApplicationStatus,
    default: EnumApplicationStatus.IN_REVIEW,
  })
  status: ApplicationStatus;

  @Prop({
    default: now(),
  })
  createdAt: Date;

  @Prop({
    default: now(),
  })
  updatedAt: Date;
}

export const ApplicationSchema = SchemaFactory.createForClass(ApplicationModel);
// Index for faster querying on frequently accessed fields
ApplicationSchema.index({ name: 1 }, { unique: true });
ApplicationSchema.index({ status: 1 });
