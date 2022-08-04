const mongoose = require('mongoose');
const User = require('./user.schema');
const { Schema, model } = mongoose;

const tourSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a max group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: ['easy', 'medium', 'difficult'],
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, 'A rating must be at least 1'],
      max: [5, 'A rating must be at most 5'],
    },
    ratingNumber: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    photo: [{ type: String }],
    organizer: {
      type: mongoose.Schema.Types.ObjectId, // Object id
      ref: 'User', // collection of which model is referring to
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    tourists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tourist' }],
  },
  {
    timestamps: true,
  }
);

tourSchema.methods.like = async function (id, session) {
  const user = await User.findById(id);

  if (user.disliked.includes(this._id)) {
    console.log('Already disliked this tour');
    await User.findByIdAndUpdate(
      id,
      {
        $pull: {
          disliked: this._id,
        },
      },
      {
        session,
      }
    );

    this.dislikes -= 1;
  }

  if (user.liked.includes(this._id)) {
    console.log('Already liked this tour');

    this.likes -= 1;

    await User.findByIdAndUpdate(
      id,

      {
        $pull: { liked: this._id },
      },
      {
        session,
      }
    );

    return;
  }

  console.log('Liking this tour');

  this.likes += 1;

  await User.findByIdAndUpdate(id, {
    $push: { liked: this._id },
  });

  await this.save();

};

tourSchema.methods.dislike = async function (id, session) {
  const user = await User.findById(id);

  if (user.liked.includes(this._id)) {
    await User.findByIdAndUpdate(
      id,
      {
        $pull: {
          liked: this._id,
        },
      },
      {
        session,
      }
    );

    this.likes -= 1;
  }

  if (user.disliked.includes(this._id)) {
    this.dislikes -= 1;

    await User.findByIdAndUpdate(
      id,
      {
        $pull: { liked: this._id },
      },
      {
        session,
      }
    );

    return;
  }

  this.dislikes += 1;

  await User.findByIdAndUpdate(
    id,
    {
      $push: { disliked: this._id },
    },
    {
      session,
    }
  );

  await this.save({ session });
};

const Tour = model('Tour', tourSchema);

module.exports = Tour;
