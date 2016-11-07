import Helper, { states } from './_helper';
import { module, test } from 'qunit';

module('Integration | ORM | Has Many | Reflexive | association #new', {
  beforeEach() {
    this.helper = new Helper();
  }
});

/*
  The model can make a new unsaved belongs-to association, for all states
*/

states.forEach((state) => {

  test(`a ${state} can build a new associated parent`, function(assert) {
    let [ tag ] = this.helper[state]();
    let initialCount = tag.tags.models.length;

    let blueTag = tag.newTag({ name: 'Blue' });

    assert.ok(!blueTag.id, 'the child was not persisted');
    assert.equal(tag.tags.models.length, initialCount + 1);

    blueTag.save();

    assert.deepEqual(blueTag.attrs, { id: blueTag.id, name: 'Blue', tagIds: [ tag.id ] }, 'the child was persisted');
    assert.equal(tag.tags.models.length, initialCount + 1, 'the collection size was increased');
    assert.deepEqual(tag.tags.models.filter((a) => a.id === blueTag.id)[0].attrs, blueTag.attrs, 'the model was added to tag.tags');
    assert.ok(tag.tagIds.indexOf(blueTag.id) > -1, 'the id was added to the fks array');
  });

});
