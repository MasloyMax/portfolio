from collections.abc import Callable
from typing import NamedTuple

from .portfolio_actions import PortfolioActions
from .portfolio_expect import PortfolioExpect


class PortfolioPage(NamedTuple):
    actions: PortfolioActions
    check: PortfolioExpect


OpenPage = Callable[[], PortfolioPage]
