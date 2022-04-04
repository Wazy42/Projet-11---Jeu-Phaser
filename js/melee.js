export function hit(game, sprite, attackDamage) {
  var sprite = game.physics.add.sprite(player.x, player.y, 'Punch').setOrigin(0, 0);
  sprite.body.setSize(15, 15, 5, 5);
}