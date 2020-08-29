import {Card} from './card';

export const CARDS: Card[] = [
  {
    name: 'Card1',
    status: 'DRAFT',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla lobortis consectetur erat eget molestie. Donec id ultrices mauris. Fusce venenatis luctus nulla a imperdiet. Donec lacus lectus, tincidunt non facilisis id, interdum quis tellus. Phasellus auctor mattis sagittis. Curabitur pretium neque at felis rhoncus, at aliquet nisi rutrum. Ut quis nunc viverra, facilisis nulla a, porttitor elit. Fusce in tellus dignissim, tempor felis at, auctor tortor. Nulla vitae blandit turpis. Fusce fringilla magna vel magna aliquam, id molestie ligula luctus. Integer ut lorem at metus semper tincidunt at viverra elit. Phasellus rhoncus placerat accumsan. Nulla dolor mi, cursus sed accumsan.',
    authorId: 1,
    authorUserName: 'Seph',
    categoryId: 1,
    categoryName: 'Poll'
  },
  {
    name: 'Card2',
    status: 'PUBLISH',
    content: 'Test content 2',
    authorId: 2,
    authorUserName: 'john.doe',
    categoryId: 2,
    categoryName: 'C++'
  }
];
