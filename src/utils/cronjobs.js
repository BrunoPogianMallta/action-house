const cron = require('node-cron');
const { Item, Auction } = require('../models'); 
const { Op } = require('sequelize');

let isRunning = false; // Verificador de execução

cron.schedule('*/5 * * * *', async () => {
  if (isRunning) {
    console.log('Execução anterior ainda em andamento. Pulando esta execução.');
    return;
  }

  isRunning = true; // Marca como em execução

  try {
    console.log('Iniciando verificação de itens expirados...');

    const now = new Date();
    console.log(`Data e hora atual: ${now}`);

    // Buscar itens expirados
    const expiredItems = await Item.findAll({
      where: {
        saleExpirationDate: {
          [Op.lt]: now,
        },
      },
    });

    console.log(`Itens expirados encontrados: ${expiredItems.length}`);
    if (expiredItems.length > 0) {
      expiredItems.forEach(item => {
        console.log(`Item expirado: ID=${item.id}, Nome=${item.name}, Data de Expiração=${item.saleExpirationDate}`);
      });

      // Remover leilões relacionados
      const itemIds = expiredItems.map(item => item.id);
      console.log(`Removendo leilões dos itens: ${itemIds.join(', ')}`);
      
      await Auction.destroy({
        where: {
          itemId: itemIds,
        },
      });

      // Remover os itens
      console.log(`Removendo itens expirados: ${itemIds.join(', ')}`);
      await Item.destroy({
        where: {
          id: itemIds,
        },
      });

      console.log(`${expiredItems.length} itens expirados removidos do leilão.`);
    } else {
      console.log('Nenhum item expirado encontrado.');
    }
  } catch (error) {
    console.error('Erro ao remover itens expirados:', error);
  } finally {
    isRunning = false; // Libera para a próxima execução
  }
});
