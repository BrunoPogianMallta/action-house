const cron = require('node-cron');
const { Item, Auction } = require('../models'); 
const { Op } = require('sequelize');


cron.schedule('0 * * * *', async () => {
  try {
    console.log('Verificando itens expirados...');

    const now = new Date();

    
    const expiredItems = await Item.findAll({
      where: {
        saleExpirationDate: {
          [Op.lt]: now,
        },
      },
    });

    if (expiredItems.length > 0) {
      
      await Auction.destroy({
        where: {
          itemId: expiredItems.map(item => item.id),
        },
      });

      await Item.destroy({
        where: {
          id: expiredItems.map(item => item.id),
        },
      });

      console.log(`${expiredItems.length} itens expirados removidos do leilão.`);
    } else {
      console.log('Nenhum item expirado encontrado.');
    }
  } catch (error) {
    console.error('Erro ao remover itens expirados:', error);
  }
});
