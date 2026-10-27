from collections.abc import Callable
from typing import NamedTuple

from .portfolio_actions import PortfolioActions
from .portfolio_expect import PortfolioExpect


# Именованный кортеж объединяет действия и проверки одной страницы.
# Его можно распаковать как actions, check = open_page() или читать через portfolio.actions/check.
class PortfolioPage(NamedTuple):
    actions: PortfolioActions
    check: PortfolioExpect


# Тип функции без аргументов, возвращающей PortfolioPage. Это подсказка IDE, а не сама фикстура.
OpenPage = Callable[[], PortfolioPage]
