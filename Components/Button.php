<?php
/**
 * NiftyGrid - DataGrid for Nette
 *
 * @author	Jakub Holub
 * @copyright	Copyright (c) 2012 Jakub Holub
 * @license     New BSD Licence
 * @link        http://addons.nette.org/cs/niftygrid
 */
namespace NiftyGrid;

use Nette\Utils\Html;
use NiftyGrid\Grid; // For constant only

class Button extends \Nette\Application\UI\PresenterComponent
{
	/** @var callback|string */
	private $label;

	/** @var callback|string */
	private $link;

	/** @var callback|string */
	private $class;

	/** @var callback|string */
	private $dialog;

	/** @var bool */
	private $ajax = TRUE;

	/** @var callback|bools */
	private $show = TRUE;
    
	/**
	 * @param bool $show
	 * @return Button
	 */
	public function setShow($show)
	{
		$this->show = $show;
		return $this;
	}
	/**
	 * @param array $row
	 * @return bool
	 */
	private function getShow($row)
	{
		if(is_callable($this->show)){
			return call_user_func($this->show, $row);
		}
		return $this->show;
	}   
	
	/**
	 * @param string $label
	 * @return Button
	 */
	public function setLabel($label)
	{
		$this->label = $label;

		return $this;
	}

	/**
	 * @param array $row
	 * @return string
	 */
	private function getLabel($row)
	{
		if(is_callable($this->label)){
			return call_user_func($this->label, $row);
		}
		return $this->label;
	}

	/**
	 * @param callback|string $link
	 * @return Button
	 */
	public function setLink($link)
	{
		$this->link = $link;

		return $this;
	}

	/**
	 * @param array $row
	 * @return string
	 */
	private function getLink($row)
	{
		if(is_callable($this->link)){
			return call_user_func($this->link, $row);
		}
		return $this->link;
	}

	/**
	 * @param callback|string $class
	 * @return Button
	 */
	public function setClass($class)
	{
		$this->class = $class;

		return $this;
	}

	/**
	 * @param array $row
	 * @return callback|mixed|string
	 */
	private function getClass($row)
	{
		if(is_callable($this->class)){
			return call_user_func($this->class, $row);
		}
		return $this->class;
	}

	/**
	 * @param bool $ajax
	 * @return Button
	 */
	public function setAjax($ajax = TRUE)
	{
		$this->ajax = $ajax;

		return $this;
	}

	/**
	 * @param callback|string $message
	 * @return Button
	 */
	public function setConfirmationDialog($message)
	{
		$this->dialog = $message;

		return $this;
	}

	/**
	 * @param array $row
	 * @return callback|mixed|string
	 */
	public function getConfirmationDialog($row)
	{
		if(is_callable($this->dialog)){
			return call_user_func($this->dialog, $row);
		}
		return $this->dialog;
	}

	/**
	 * @return bool
	 */
	private function hasConfirmationDialog()
	{
		return (!empty($this->dialog)) ? TRUE : FALSE;
	}

	/**
	 * @param array $row
	 */
	public function render($row)
	{
        	if($this->getShow($row)){		
			$el = Html::el("a")
				->href($this->getLink($row))
				->setClass($this->getClass($row))
				->addClass("grid-button")
				->setTitle($this->getLabel($row));
	
			if($this->getName() == Grid::ROW_FORM) {
				$el->addClass("grid-editable");
			}
	
			if($this->hasConfirmationDialog()){
				$el->addClass("grid-confirm")
					->addData("grid-confirm", $this->getConfirmationDialog($row));
			}
	
			if($this->ajax){
				$el->addClass("grid-ajax");
			}
			echo $el;
        	}
	}

}
