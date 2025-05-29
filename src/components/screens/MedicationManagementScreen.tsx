
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pill, Edit, Trash2, Info } from 'lucide-react';

export const MedicationManagementScreen = () => {
  const { toast } = useToast();
  const [medications, setMedications] = useState([
    { id: 1, name: 'ロキソニン錠60mg', standardDose: '1', unit: '錠', memo: '痛み止め・食後に服用' },
    { id: 2, name: 'ガスター錠20mg', standardDose: '1', unit: '錠', memo: '胃薬・空腹時でも可' },
    { id: 3, name: 'ムコダイン錠250mg', standardDose: '3', unit: '錠', memo: '去痰薬・水分を多めに摂取' },
  ]);

  const [newMedication, setNewMedication] = useState({
    name: '',
    standardDose: '',
    unit: '錠',
    memo: ''
  });

  const [editingMedication, setEditingMedication] = useState<any>(null);

  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.standardDose) {
      toast({
        title: "エラー",
        description: "薬剤名と標準服用量を入力してください。",
        variant: "destructive",
      });
      return;
    }

    const newMed = {
      id: Date.now(),
      ...newMedication
    };

    setMedications([...medications, newMed]);
    setNewMedication({ name: '', standardDose: '', unit: '錠', memo: '' });
    
    toast({
      title: "追加完了",
      description: "薬剤を追加しました。",
    });
  };

  const handleEditMedication = (medication: any) => {
    setEditingMedication({ ...medication });
  };

  const handleSaveEdit = () => {
    if (!editingMedication.name || !editingMedication.standardDose) {
      toast({
        title: "エラー",
        description: "薬剤名と標準服用量を入力してください。",
        variant: "destructive",
      });
      return;
    }

    setMedications(medications.map(med => 
      med.id === editingMedication.id ? editingMedication : med
    ));
    setEditingMedication(null);
    
    toast({
      title: "更新完了",
      description: "薬剤情報を更新しました。",
    });
  };

  const handleDeleteMedication = (id: number) => {
    setMedications(medications.filter(med => med.id !== id));
    toast({
      title: "削除完了",
      description: "薬剤を削除しました。",
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">薬剤管理</h2>
        <p className="text-sm sm:text-base text-gray-600">服用する薬剤の情報を管理できます</p>
      </div>

      {/* 薬剤追加 */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-emerald-50">
        <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg">
          <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            新しい薬剤を追加
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                薬剤名 *
              </Label>
              <Input
                id="name"
                value={newMedication.name}
                onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                placeholder="例: ロキソニン錠60mg"
                className="border-emerald-200 focus:border-emerald-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="dose" className="text-sm font-medium text-gray-700 mb-2 block">
                  標準服用量 *
                </Label>
                <Input
                  id="dose"
                  type="number"
                  step="0.5"
                  min="0"
                  value={newMedication.standardDose}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, standardDose: e.target.value }))}
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>
              <div>
                <Label htmlFor="unit" className="text-sm font-medium text-gray-700 mb-2 block">
                  単位
                </Label>
                <Input
                  id="unit"
                  value={newMedication.unit}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, unit: e.target.value }))}
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="memo" className="text-sm font-medium text-gray-700 mb-2 block">
              メモ（任意）
            </Label>
            <Textarea
              id="memo"
              value={newMedication.memo}
              onChange={(e) => setNewMedication(prev => ({ ...prev, memo: e.target.value }))}
              placeholder="服用に関する注意事項やメモ"
              className="resize-none border-emerald-200 focus:border-emerald-500"
              rows={2}
            />
          </div>
          <Button 
            onClick={handleAddMedication}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            薬剤を追加
          </Button>
        </CardContent>
      </Card>

      {/* 薬剤一覧 */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-emerald-50">
        <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg">
          <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <Pill className="w-4 h-4 sm:w-5 sm:h-5" />
            登録済み薬剤一覧
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {medications.map((medication) => (
              <div key={medication.id} className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-emerald-100">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 text-sm sm:text-base mb-1">{medication.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      標準服用量: {medication.standardDose} {medication.unit}
                    </p>
                    {medication.memo && (
                      <div className="flex items-start gap-2 p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                        <Info className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs sm:text-sm text-emerald-700">{medication.memo}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditMedication(medication)}
                          className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-xs sm:text-sm px-2 sm:px-3"
                        >
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          編集
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-[95vw] max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-base sm:text-lg">薬剤情報編集</DialogTitle>
                        </DialogHeader>
                        {editingMedication && (
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700 mb-2 block">薬剤名 *</Label>
                              <Input
                                value={editingMedication.name}
                                onChange={(e) => setEditingMedication(prev => ({ ...prev, name: e.target.value }))}
                                className="text-sm"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-sm font-medium text-gray-700 mb-2 block">標準服用量 *</Label>
                                <Input
                                  type="number"
                                  step="0.5"
                                  min="0"
                                  value={editingMedication.standardDose}
                                  onChange={(e) => setEditingMedication(prev => ({ ...prev, standardDose: e.target.value }))}
                                  className="text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700 mb-2 block">単位</Label>
                                <Input
                                  value={editingMedication.unit}
                                  onChange={(e) => setEditingMedication(prev => ({ ...prev, unit: e.target.value }))}
                                  className="text-sm"
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700 mb-2 block">メモ</Label>
                              <Textarea
                                value={editingMedication.memo}
                                onChange={(e) => setEditingMedication(prev => ({ ...prev, memo: e.target.value }))}
                                className="resize-none text-sm"
                                rows={3}
                              />
                            </div>
                            <Button 
                              onClick={handleSaveEdit}
                              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm"
                            >
                              保存
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-red-200 text-red-600 hover:bg-red-50 text-xs sm:text-sm px-2 sm:px-3"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          削除
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="w-[95vw] max-w-md">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-base">薬剤を削除しますか？</AlertDialogTitle>
                          <AlertDialogDescription className="text-sm">
                            「{medication.name}」を削除します。この操作は取り消せません。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                          <AlertDialogCancel className="text-sm">キャンセル</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteMedication(medication.id)}
                            className="bg-red-600 hover:bg-red-700 text-sm"
                          >
                            削除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
