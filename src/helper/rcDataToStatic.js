import { t } from "i18next";

export const mapRevenueCatDataToStaticFormat = (revenueCatData, type = 'subscription') => {
    return revenueCatData.map((item, index) => {
      let duration = "";
      let durationText = "";
      let label = "";
      let pricePerMonth = "";
  
      switch (type.toLowerCase()) {
        case 'subscription':
          // Subscription duration belirleme
          switch (item.packageType) {
            case "MONTHLY":
              duration = "1";
              durationText = "Month";
              break;
            case "THREE_MONTH":
              duration = "3";
              durationText = "Months";
              break;
            case "SIX_MONTH":
              duration = "6";
              durationText = "Months";
              break;
            case "ANNUAL":
              duration = "12";
              durationText = "Months";
              break;
            default:
              // Title'dan çıkarmaya çalış
              const titleMatch = item.product.title.match(/(\d+)\s*(Aylık|Month)/i);
              duration = titleMatch ? titleMatch[1] : "1";
              durationText = duration === "1" ? "Month" : "Months";
          }
  
          // Subscription label belirleme
          if (item.packageType === "THREE_MONTH") {
            label = t("POPULAR");
          } else if (item.packageType === "SIX_MONTH") {
            // 6 aylık pakette indirim hesapla
            const monthlyPrice = revenueCatData.find((s) => s.packageType === "MONTHLY")?.product?.price || 0;
            if (monthlyPrice > 0) {
              const discount = Math.round((1 - item.product.pricePerMonth / monthlyPrice) * 100);
              if (discount > 0) {
                label = `-${discount}%`;
              }
            }
          }
  
          // Subscription pricePerMonth
          pricePerMonth = item.product.pricePerMonthString || `${item.product.priceString}/month`;
          break;
  
        case 'joker':
        case 'superlike':
          // Joker/Superlike sayısını title'dan çıkar
          const itemCount = item.product.title.match(/x(\d+)/)?.[1] || "1";
          duration = itemCount;
  
          // Her item başına fiyat hesapla
          const totalPrice = item.product.price;
          const pricePerItem = (totalPrice / parseInt(itemCount)).toFixed(2);
          pricePerMonth = `$${pricePerItem}/each`;
  
          // Joker/Superlike label belirleme
          if (index === 1) {
            label = t("POPULAR");
          } else if (itemCount === "15" || itemCount === "20") {
            label = "-20%";
          }
          break;
  
        default:
          // Genel durumlar için temel değerler
          duration = "1";
          pricePerMonth = item.product.priceString;
      }
  
      return {
        id: index + 1,
        duration: duration,
        price: item.product.priceString,
        pricePerMonth: pricePerMonth,
        label: label,
        type: type, // Hangi tip olduğunu da saklayalım
        // Orijinal Revenue Cat datasını da saklayalım satın alma için
        originalData: item,
      };
    });
  };